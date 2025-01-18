from unittest.mock import patch
from app.models import User, Goal
from app.schemas import GoalSchema
from test_base import BaseTestCase
from app import db


class GoalTestCase(BaseTestCase):
    def test_create_goal(self):
        # Create a test user
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        # Mock the database operations
        with patch('app.routes.goals.db.session.add') as mock_add, patch('app.routes.goals.db.session.commit') as mock_commit:
            # Get an access token for the user
            access_token = self.get_access_token(user)

            # Send a POST request to create a goal
            response = self.client.post('/api/goals/', json={  # Add trailing slash
                'name': 'Test Goal',
                'target_amount': 1000.0
            }, headers={'Authorization': f'Bearer {access_token}'})

            # Assert the response status code and message
            self.assertEqual(response.status_code, 201)
            self.assertEqual(response.json, {
                'message': 'Goal created successfully',
                'goal': {
                    'id': None,  # Mocked goal ID
                    'name': 'Test Goal',
                    'target_amount': 1000.0,
                    'current_amount': None,
                    'user_id': user.id
                }
            })

            # Ensure the database operations were called
            mock_add.assert_called_once()
            mock_commit.assert_called_once()

    def test_get_goals(self):
        # Create a test user
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        # Create test goals
        goal1 = Goal(name='Goal 1', target_amount=1000.0, user_id=user.id)
        goal2 = Goal(name='Goal 2', target_amount=2000.0, user_id=user.id)
        db.session.add(goal1)
        db.session.add(goal2)
        db.session.commit()

        # Get an access token for the user
        access_token = self.get_access_token(user)

        # Send a GET request to fetch goals
        response = self.client.get('/api/goals/', headers={'Authorization': f'Bearer {access_token}'})  # Add trailing slash

        # Assert the response status code and data
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, [
            {
                'id': goal1.id,
                'name': 'Goal 1',
                'target_amount': 1000.0,
                'current_amount': 0.0
            },
            {
                'id': goal2.id,
                'name': 'Goal 2',
                'target_amount': 2000.0,
                'current_amount': 0.0
            }
        ])

    def test_update_goal(self):
        # Create a test user
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        # Create a test goal
        goal = Goal(name='Test Goal', target_amount=1000.0, user_id=user.id)
        db.session.add(goal)
        db.session.commit()

        # Get an access token for the user
        access_token = self.get_access_token(user)

        # Send a PUT request to update the goal
        response = self.client.put(f'/api/goals/{goal.id}', json={
            'name': 'Updated Goal',
            'target_amount': 2000.0,
        }, headers={'Authorization': f'Bearer {access_token}'})

        # Assert the response status code and message
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'message': 'Goal updated successfully'})

        # Verify the goal was updated
        updated_goal = db.session.get(Goal, goal.id)  # Use db.session.get
        self.assertEqual(updated_goal.name, 'Updated Goal')
        self.assertEqual(updated_goal.target_amount, 2000.0)

    def test_delete_goal(self):
        # Create a test user
        user = User(username='testuser', email='test@example.com')
        user.set_password('testpassword')
        db.session.add(user)
        db.session.commit()

        # Create a test goal
        goal = Goal(name='Test Goal', target_amount=1000.0, user_id=user.id)
        db.session.add(goal)
        db.session.commit()

        # Get an access token for the user
        access_token = self.get_access_token(user)

        # Send a DELETE request to delete the goal
        response = self.client.delete(f'/api/goals/{goal.id}', headers={'Authorization': f'Bearer {access_token}'})

        # Assert the response status code and message
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'message': 'Goal deleted successfully'})

        # Verify the goal was deleted
        deleted_goal = db.session.get(Goal, goal.id)  # Use db.session.get
        self.assertIsNone(deleted_goal)

    def get_access_token(self, user):
        # Log in the user and get an access token
        response = self.client.post('/auth/login', json={
            'username': user.username,
            'password': 'testpassword'
        })
        return response.json['access_token']