import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta, timezone
from app import db
from app.models import User, Account, Transaction, Category, Goal
from app.schemas import UserRegisterSchema, UserLoginSchema, AccountCreateSchema, TransactionCreateSchema, GoalCreateSchema, SpendingLimitCreateSchema
from test_base import BaseTestCase


class AuthTestCase(BaseTestCase):
    def test_register(self):
        # Mock database operations
        with patch('app.auth.db.session.add') as mock_add, patch('app.auth.db.session.commit') as mock_commit:
            response = self.client.post('/auth/register', json={
                'username': 'testuser',
                'email': 'test@example.com',
                'password': 'testpassword'
            })
            self.assertEqual(response.status_code, 201)  # Check for 201 status code
            self.assertEqual(response.json, {'message': 'User created successfully'})

            # Ensure the user, account, and categories were added
            self.assertTrue(mock_add.call_count >= 12)  # User + Cash account + 20 categories
            mock_commit.assert_called()

    def test_login(self):
        # Create a test user
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        # Test login with correct credentials
        response = self.client.post('/auth/login', json={
            'username': 'testuser',
            'password': 'testpassword'
        })
        self.assertEqual(response.status_code, 200)  # Check for 200 status code
        self.assertIn('access_token', response.json)

        # Test login with incorrect credentials
        response = self.client.post('/auth/login', json={
            'username': 'testuser',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 401)  # Check for 401 status code
        self.assertEqual(response.json, {'message': 'Invalid credentials'})

    def test_profile(self):
        # Create a test user
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        # Log in to get an access token
        login_response = self.client.post('/auth/login', json={
            'username': 'testuser',
            'password': 'testpassword'
        })
        access_token = login_response.json['access_token']

        # Fetch profile with the access token
        response = self.client.get('/auth/profile', headers={
            'Authorization': f'Bearer {access_token}'
        })
        self.assertEqual(response.status_code, 200)  # Check for 200 status code
        self.assertEqual(response.json, {
            'user_details': {
                'id': user.id,
                'email': user.email,
                'username': user.username
            }
        })

    @patch('app.auth.smtplib.SMTP')
    def test_forgot_password(self, mock_smtp):
        # Create a test user
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        # Mock SMTP server
        mock_server = MagicMock()
        mock_smtp.return_value.__enter__.return_value = mock_server

        # Test forgot password
        response = self.client.post('/auth/forgot-password', json={
            'email': 'test@example.com'
        })
        self.assertEqual(response.status_code, 200)  # Check for 200 status code
        self.assertEqual(response.json, {'message': 'Password reset link sent'})

        # Ensure the reset token was generated
        updated_user = User.query.filter_by(email='test@example.com').first()
        self.assertIsNotNone(updated_user.reset_token)
        self.assertIsNotNone(updated_user.reset_token_expiration)

        # Ensure the email was sent
        mock_server.starttls.assert_called_once()
        mock_server.login.assert_called_once()
        mock_server.sendmail.assert_called_once()

    def test_reset_password(self):
        # Create a test user with a reset token
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        user.reset_token = '123456'
        user.reset_token_expiration = datetime.now(timezone.utc) + timedelta(hours=1)
        db.session.add(user)
        db.session.commit()

        # Test reset password with valid token
        response = self.client.post('/auth/reset-password/123456', json={
            'new_password': 'newpassword'
        })
        self.assertEqual(response.status_code, 200)  # Check for 200 status code
        self.assertEqual(response.json, {'message': 'Password reset successfully'})

        # Ensure the password was updated
        updated_user = User.query.filter_by(email='test@example.com').first()
        self.assertTrue(updated_user.check_password('newpassword'))
        self.assertIsNone(updated_user.reset_token)
        self.assertIsNone(updated_user.reset_token_expiration)

        # Test reset password with invalid token
        response = self.client.post('/auth/reset-password/invalidtoken', json={
            'new_password': 'newpassword'
        })
        self.assertEqual(response.status_code, 400)  # Check for 400 status code
        self.assertEqual(response.json, {'message': 'Invalid or expired token'})

