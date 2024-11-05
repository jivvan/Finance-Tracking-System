from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from werkzeug.exceptions import HTTPException
from .config import config

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()


def create_app(mode='development'):
    app = Flask(__name__)
    app.config.from_object(config[mode])

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/*": {"origins": "*", "allow_headers": "Content-Type,Authorization", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})

    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        response = e.get_response()
        response.data = jsonify({
            'code': e.code,
            'name': e.name,
            'description': e.description,
        }).data
        response.content_type = 'application/json'
        return response

    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/auth')

    from .routes.accounts import accounts as accounts_blueprint
    app.register_blueprint(accounts_blueprint, url_prefix='/api/accounts')

    from .routes.transactions import transactions as transactions_blueprint
    app.register_blueprint(transactions_blueprint,
                           url_prefix='/api/transactions')

    from .routes.categories import categories as categories_blueprint
    app.register_blueprint(categories_blueprint, url_prefix='/api/categories')

    from .routes.goals import goals as goals_blueprint
    app.register_blueprint(goals_blueprint, url_prefix='/api/goals')

    from .routes.contributions import contributions as contributions_blueprint
    app.register_blueprint(contributions_blueprint,
                           url_prefix='/api/contributions')

    return app
