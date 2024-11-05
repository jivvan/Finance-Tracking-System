from app import create_app
from dotenv import load_dotenv
import sys
import os

load_dotenv()

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ['FLASK_APP'] = 'run.py'

if int(os.environ.get('DEBUG', '1')) == '1':
    application = create_app('development')
else:
    application = create_app('production')
