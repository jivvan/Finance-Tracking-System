from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
from flask_socketio import SocketIO
from .config import config

db = SQLAlchemy()
login_manager = LoginManager()
csrf = CSRFProtect()
socketio = SocketIO()


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    db.init_app(app)
    login_manager.init_app(app)
    csrf.init_app(app)
    socketio.init_app(app)

    from .models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    from .routes.auth import auth as auth_blueprint
    from .routes.transactions import transactions as transactions_blueprint
    from .routes.friends import friends as friends_blueprint
    from .routes.accounts import accounts as accounts_blueprint
    from .routes.categories import categories as categories_blueprint
    from .routes.split_bills import split_bills as split_bills_blueprint

    app.register_blueprint(auth_blueprint)
    app.register_blueprint(transactions_blueprint)
    app.register_blueprint(friends_blueprint)
    app.register_blueprint(accounts_blueprint)
    app.register_blueprint(categories_blueprint)
    app.register_blueprint(split_bills_blueprint)

    return app
