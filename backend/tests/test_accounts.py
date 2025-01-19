from unittest.mock import patch
from app.models import User, Account
from app.schemas import AccountSchema
from test_base import BaseTestCase
from app import db

class AccountTestCase(BaseTestCase):
    def test_create_account(self):
        # Create a test user
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        # Mock the database operations
        with patch('app.routes.accounts.db.session.add') as mock_add, patch('app.routes.accounts.db.session.commit') as mock_commit:
            # Get an access token for the user
            access_token = self.get_access_token(user)

            # Send a POST request to create an account
            response = self.client.post('/api/accounts/', json={
                'name': 'Test Account',
                'balance': 1000.0
            }, headers={'Authorization': f'Bearer {access_token}'})

            # Assert the response status code and message
            self.assertEqual(response.status_code, 201)
            self.assertEqual(response.json, {
                'message': 'Account created successfully',
                'account': {
                    'id': None,
                    'name': 'Test Account',
                    'balance': 1000.0,
                    'transactions': [],
                    'user_id': user.id
                }
            })

            # Ensure the database operations were called
            mock_add.assert_called_once()
            mock_commit.assert_called_once()

    def test_create_account_with_existing_name(self):
        # Create a test user
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        # Create an existing account with the same name
        existing_account = Account(name='Test Account', balance=500.0, user_id=user.id)
        db.session.add(existing_account)
        db.session.commit()

        # Get an access token for the user
        access_token = self.get_access_token(user)

        # Send a POST request to create an account with the same name
        response = self.client.post('/api/accounts/', json={
            'name': 'Test Account',
            'balance': 1000.0
        }, headers={'Authorization': f'Bearer {access_token}'})

        # Assert the response status code and message
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json, {'message': 'Account with same name already exists'})

    def test_get_accounts(self):
        # Create a test user
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        # Create test accounts
        account1 = Account(name='Account 1', balance=1000.0, user_id=user.id)
        account2 = Account(name='Account 2', balance=2000.0, user_id=user.id)
        db.session.add(account1)
        db.session.add(account2)
        db.session.commit()

        # Get an access token for the user
        access_token = self.get_access_token(user)

        # Send a GET request to fetch accounts
        response = self.client.get('/api/accounts/', headers={'Authorization': f'Bearer {access_token}'})

        # Assert the response status code and data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, [
            {'id': account1.id, 'name': 'Account 1', 'balance': 1000.0, 'user_id': user.id, 'transactions':[]},
            {'id': account2.id, 'name': 'Account 2', 'balance': 2000.0, 'user_id': user.id, 'transactions': []}
        ])

    def test_update_account(self):
        # Create a test user
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        # Create a test account
        account = Account(name='Test Account', balance=1000.0, user_id=user.id)
        db.session.add(account)
        db.session.commit()

        # Get an access token for the user
        access_token = self.get_access_token(user)

        # Send a PUT request to update the account
        response = self.client.put(f'/api/accounts/{account.id}', json={
            'name': 'Updated Account',
            'balance': 2000.0
        }, headers={'Authorization': f'Bearer {access_token}'})

        # Assert the response status code and message
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'message': 'Account updated successfully'})

        # Verify the account was updated
        updated_account = Account.query.get(account.id)
        self.assertEqual(updated_account.name, 'Updated Account')
        self.assertEqual(updated_account.balance, 2000.0)

    def test_delete_account(self):
        # Create a test user
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        # Create a test account
        account = Account(name='Test Account', balance=1000.0, user_id=user.id)
        db.session.add(account)
        db.session.commit()

        # Get an access token for the user
        access_token = self.get_access_token(user)

        # Send a DELETE request to delete the account
        response = self.client.delete(f'/api/accounts/{account.id}', headers={'Authorization': f'Bearer {access_token}'})

        # Assert the response status code and message
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'message': 'Account deleted successfully'})

        # Verify the account was deleted
        deleted_account = Account.query.get(account.id)
        self.assertIsNone(deleted_account)

    def get_access_token(self, user):
        # Log in the user and get an access token
        response = self.client.post('/auth/login', json={
            'username': user.username,
            'password': 'testpassword'
        })
        return response.json['access_token']