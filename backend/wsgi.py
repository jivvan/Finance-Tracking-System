import sys
import os

# Add the backend directory to the system path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set the Flask app environment variable
os.environ['FLASK_APP'] = 'run.py'

# Import the create_app function and instantiate the app
from app import create_app

# Create the app with the 'development' configuration
application = create_app('development')

