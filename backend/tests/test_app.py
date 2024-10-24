import unittest
from unittest.mock import patch
from flask_testing import TestCase
from app import create_app, db
from app.models import User, Account, Transaction, Category, Goal, SpendingLimit
from app.schemas import UserRegisterSchema, UserLoginSchema, AccountCreateSchema, TransactionCreateSchema, GoalCreateSchema, SpendingLimitCreateSchema


class BaseTestCase(TestCase):
    def create_app(self):
        app = create_app()
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        return app

    def setUp(self):
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()


class AuthTestCase(BaseTestCase):
    def test_register(self):
        with patch('app.auth.db.session.add') as mock_add, patch('app.auth.db.session.commit') as mock_commit:
            response = self.client.post('/auth/register', json={
                'username': 'testuser',
                'email': 'test@example.com',
                'password': 'testpassword'
            })
            self.assert201(response)
            mock_add.assert_called_once()
            mock_commit.assert_called_once()

    def test_login(self):
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        response = self.client.post('/auth/login', json={
            'username': 'testuser',
            'password': 'testpassword'
        })
        self.assert200(response)
        self.assertIn('access_token', response.json)


class AccountTestCase(BaseTestCase):
    def test_create_account(self):
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        with patch('app.routes.accounts.db.session.add') as mock_add, patch('app.routes.accounts.db.session.commit') as mock_commit:
            response = self.client.post('/api/accounts', json={
                'name': 'Test Account',
                'balance': 1000.0
            }, headers={'Authorization': f'Bearer {self.get_access_token(user)}'})
            self.assert201(response)
            mock_add.asset_called_once()
            mock_commit.assert_called_once()

    def get_access_token(self, user):
        response = self.client.post('/auth/login', json={
            'username': user.username,
            'password': 'testpassword'
        })
        return response.json['access_token']


class TransactionTestCase(BaseTestCase):
    def test_create_transaction(self):
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        account = Account(name='Test Account', balance=1000.0, user_id=user.id)
        db.session.add(account)
        db.session.commit()

        category = Category(name='Test Category', user_id=user.id)
        db.session.add(category)
        db.session.commit()

        with patch('app.routes.transactions.db.session.add') as mock_add, patch('app.routes.transactions.db.session.commit') as mock_commit:
            response = self.client.post('/api/transactions', json={
                'amount': 100.0,
                'description': 'Test Transaction',
                'account_id': account.id,
                'category_id': category.id
            }, headers={'Authorization': f'Bearer {self.get_access_token(user)}'})
            self.assert201(response)
            mock_add.assert_called_once()
            mock_commit.assert_called_once()

    def get_access_token(self, user):
        response = self.client.post('/auth/login', json={
            'username': user.username,
            'password': 'testpassword'
        })
        return response.json['access_token']


class GoalTestCase(BaseTestCase):
    def test_create_goal(self):
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        with patch('app.routes.goals.db.session.add') as mock_add, patch('app.routes.goals.db.session.commit') as mock_commit:
            response = self.client.post('/api/goals', json={
                'name': 'Test Goal',
                'target_amount': 1000.0
            }, headers={'Authorization': f'Bearer {self.get_access_token(user)}'})
            self.assert201(response)
            mock_add.assert_called_once()
            mock_commit.assert_called_once()

    def get_access_token(self, user):
        response = self.client.post('/auth/login', json={
            'username': user.username,
            'password': 'testpassword'
        })
        return response.json['access_token']


class SpendingLimitTestCase(BaseTestCase):
    def test_create_spending_limit(self):
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        category = Category(name='Test Category', user_id=user.id)
        db.session.add(category)
        db.session.commit()

        with patch('app.routes.spending_limits.db.session.add') as mock_add, patch('app.routes.spending_limits.db.session.commit') as mock_commit:
            response = self.client.post('/api/spending-limits', json={
                'limit_amount': 500.0,
                'category_id': category.id
            }, headers={'Authorization': f'Bearer {self.get_access_token(user)}'})
            self.assert201(response)
            mock_add.assert_called_once()
            mock_commit.assert_called_once()

    def get_access_token(self, user):
        response = self.client.post('/auth/login', json={
            'username': user.username,
            'password': 'testpassword'
        })
        return response.json['access_token']


if __name__ == '__main__':
    unittest.main()
