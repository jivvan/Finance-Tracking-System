from app import create_app
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ['FLASK_APP'] = 'run.py'

application = create_app()
