from unittest.mock import patch
from app.models import User, Transaction
from test_base import BaseTestCase
from app import db
from datetime import datetime
from app.models import User, Account, Transaction, Category
from app.schemas import TransactionCreateSchema, TransactionUpdateSchema

class TransactionTestCase(BaseTestCase):
    def test_create_transaction(self):
        # Create a test user
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        # Create a test account
        account = Account(name='Test Account', balance=1000.0, user_id=user.id)
        db.session.add(account)
        db.session.commit()

        # Create a test category
        category = Category(name='Test Category', user_id=user.id)
        db.session.add(category)
        db.session.commit()

        # Mock the database operations
        with patch('app.routes.transactions.db.session.add') as mock_add, patch('app.routes.transactions.db.session.commit') as mock_commit:
            # Get an access token for the user
            access_token = self.get_access_token(user)

            # Format the date as "YYYY-MM-DD HH:MM:SS"
            date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            # Send a POST request to create a transaction
            response = self.client.post('/api/transactions/', json={
                'amount': 100.0,
                'description': 'Test Transaction',
                'account_id': account.id,
                'category_id': category.id,
                'date': date  # Use the formatted date
            }, headers={'Authorization': f'Bearer {access_token}'})

            # Assert the response status code and message
            self.assertEqual(response.status_code, 201)
            self.assertEqual(response.json, {'message': 'Transaction created successfully'})

            # Ensure the database operations were called
            mock_add.assert_called_once()
            mock_commit.assert_called_once()

    def test_get_transactions(self):
        # Create a test user
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        # Create a test account
        account = Account(name='Test Account', balance=1000.0, user_id=user.id)
        db.session.add(account)
        db.session.commit()

        # Create test transactions
        transaction1 = Transaction(amount=100.0, description='Transaction 1', account_id=account.id, category_id=1, date=datetime.now())
        transaction2 = Transaction(amount=200.0, description='Transaction 2', account_id=account.id, category_id=2, date=datetime.now())
        db.session.add(transaction1)
        db.session.add(transaction2)
        db.session.commit()

        # Get an access token for the user
        access_token = self.get_access_token(user)

        # Send a GET request to fetch transactions
        response = self.client.get('/api/transactions/', headers={'Authorization': f'Bearer {access_token}'})  # Add trailing slash

        # Assert the response status code and data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json['transactions']), 2)

    def test_update_transaction(self):
        # Create a test user
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        # Create a test account
        account = Account(name='Test Account', balance=1000.0, user_id=user.id)
        db.session.add(account)
        db.session.commit()

        # Create a test category
        category = Category(name='Test Category', user_id=user.id)
        db.session.add(category)
        db.session.commit()

        # Create a test transaction
        transaction = Transaction(amount=100.0, description='Test Transaction', account_id=account.id, category_id=category.id, date=datetime.now())
        db.session.add(transaction)
        db.session.commit()

        # Get an access token for the user
        access_token = self.get_access_token(user)

        # Send a PUT request to update the transaction
        response = self.client.put(f'/api/transactions/{transaction.id}', json={
            'amount': 200.0,
            'description': 'Updated Transaction',
            'account_id': account.id,
            'category_id': category.id
        }, headers={'Authorization': f'Bearer {access_token}'})

        # Assert the response status code and message
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'message': 'Transaction updated successfully'})

        # Verify the transaction was updated
        updated_transaction = db.session.get(Transaction, transaction.id)  # Use db.session.get
        self.assertEqual(updated_transaction.amount, 200.0)
        self.assertEqual(updated_transaction.description, 'Updated Transaction')

    def test_delete_transaction(self):
        # Create a test user
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        # Create a test account
        account = Account(name='Test Account', balance=1000.0, user_id=user.id)
        db.session.add(account)
        db.session.commit()

        # Create a test transaction
        transaction = Transaction(amount=100.0, description='Test Transaction', account_id=account.id, category_id=1, date=datetime.now())
        db.session.add(transaction)
        db.session.commit()

        # Get an access token for the user
        access_token = self.get_access_token(user)

        # Send a DELETE request to delete the transaction
        response = self.client.delete(f'/api/transactions/{transaction.id}', headers={'Authorization': f'Bearer {access_token}'})

        # Assert the response status code and message
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'message': 'Transaction deleted successfully'})

        # Verify the transaction was deleted
        deleted_transaction = db.session.get(Transaction, transaction.id)  # Use db.session.get
        self.assertIsNone(deleted_transaction)

    def get_access_token(self, user):
        # Log in the user and get an access token
        response = self.client.post('/auth/login', json={
            'username': user.username,
            'password': 'testpassword'
        })
        return response.json['access_token']