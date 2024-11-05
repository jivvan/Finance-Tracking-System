from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import User, db, Account, Category
from .schemas import UserRegisterSchema, UserLoginSchema, ForgotPasswordSchema

auth = Blueprint('auth', __name__)


@auth.route('/register', methods=['POST'])
def register():
    schema = UserRegisterSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400

    data = schema.load(request.json)
    username = data['username']
    email = data['email']
    password = data['password']

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists'}), 400

    # Create and commit the new user
    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()  # Commit to get the new_user.id

    # Create a Cash account for the user
    cash_account = Account(name="Cash", balance=0.0, user_id=new_user.id)
    db.session.add(cash_account)

    # Add basic categories for expenses and income
    categories = [
        {"name": "Food", "category_type": "expense", "user_id": new_user.id},
        {"name": "Transport", "category_type": "expense", "user_id": new_user.id},
        {"name": "Entertainment", "category_type": "expense", "user_id": new_user.id},
        {"name": "Salary", "category_type": "income", "user_id": new_user.id},
        {"name": "Investments", "category_type": "income", "user_id": new_user.id},
    ]

    for category_data in categories:
        category = Category(**category_data)
        db.session.add(category)

    # Final commit for account and categories
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201


@auth.route('/login', methods=['POST'])
def login():
    schema = UserLoginSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400

    data = schema.load(request.json)
    username = data['username']
    password = data['password']

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token}), 200

    return jsonify({'message': 'Invalid credentials'}), 401


@auth.route('/forgot-password', methods=['POST'])
def forgot_password():
    schema = ForgotPasswordSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400

    data = schema.load(request.json)
    email = data['email']

    # Implement forgot password logic here
    return jsonify({'message': 'Password reset link sent'}), 200
