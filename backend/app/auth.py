import os
import random
import secrets
from datetime import datetime, timedelta
from .utils import jwt_required_user_exists
from .models import User, db, Account, Category
from .schemas import UserRegisterSchema, UserLoginSchema, ForgotPasswordSchema, ResetPasswordSchema
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import smtplib
from email.mime.text import MIMEText

auth = Blueprint('auth', __name__)

# Zoho Mail SMTP configuration
ZOHO_SMTP_SERVER = 'smtp.zoho.com'
ZOHO_SMTP_PORT = 587
ZOHO_EMAIL = 'jivanparajuli@jivanparajuli.com.np'
ZOHO_PASSWORD = os.getenv('ZOHO_PASSWORD') 

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
        # Income Categories: Salary,Freelance, Investments, Rentals, Business, Gifts, Refunds, Dividends, Royalties, Other Income
        {"name": "Salary", "category_type": "income", "user_id": new_user.id},
        {"name": "Freelance", "category_type": "income", "user_id": new_user.id},
        {"name": "Investments", "category_type": "income", "user_id": new_user.id},
        {"name": "Rentals", "category_type": "income", "user_id": new_user.id},
        {"name": "Business", "category_type": "income", "user_id": new_user.id},
        {"name": "Gifts", "category_type": "income", "user_id": new_user.id},
        {"name": "Refunds", "category_type": "income", "user_id": new_user.id},
        {"name": "Dividends", "category_type": "income", "user_id": new_user.id},
        {"name": "Royalties", "category_type": "income", "user_id": new_user.id},
        {"name": "Other Income", "category_type": "income", "user_id": new_user.id},

        # Expense Categories: Groceries, Dining, Utilities, Rent/Mortgage, Transportation, Health, Entertainment, Clothing, Education, Other Expenses
        {"name": "Groceries", "category_type": "expense", "user_id": new_user.id},
        {"name": "Dining", "category_type": "expense", "user_id": new_user.id},
        {"name": "Utilities", "category_type": "expense", "user_id": new_user.id},
        {"name": "Rent/Mortgage", "category_type": "expense", "user_id": new_user.id},
        {"name": "Transportation", "category_type": "expense", "user_id": new_user.id},
        {"name": "Health", "category_type": "expense", "user_id": new_user.id},
        {"name": "Entertainment", "category_type": "expense", "user_id": new_user.id},
        {"name": "Clothing", "category_type": "expense", "user_id": new_user.id},
        {"name": "Education", "category_type": "expense", "user_id": new_user.id},
        {"name": "Other Expenses", "category_type": "expense", "user_id": new_user.id},
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


@auth.route('/profile', methods=['GET'])
@jwt_required_user_exists
def profile():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({'message': 'Unable to fetch user details'}), 401
    user = {
        'id': user.id,
        'email': user.email,
        'username': user.username
    }
    return jsonify({'user_details': user}), 200

def generate_reset_token(user):
    code = ''.join(random.choices('0123456789', k=6))
    
    user.reset_token = code
    user.reset_token_expiration = datetime.utcnow() + timedelta(hours=1)
    db.session.commit()
    
    return code


def send_reset_email(user):
    token = generate_reset_token(user)  

    frontend_host = request.headers.get('Origin')  
    if not frontend_host:
        frontend_host = request.host_url 

    subject = 'Password Reset Request'
    body = f'''To reset your password, use the code:
{token}

This code will be valid for next 1 hour.

If you did not make this request, simply ignore this email and no changes will be made.
'''

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = ZOHO_EMAIL
    msg['To'] = user.email

    try:
        with smtplib.SMTP(ZOHO_SMTP_SERVER, ZOHO_SMTP_PORT) as server:
            server.starttls() 
            server.login(ZOHO_EMAIL, ZOHO_PASSWORD) 
            server.sendmail(ZOHO_EMAIL, [user.email], msg.as_string())  
    except Exception as e:
        print(f"Failed to send email: {e}")


@auth.route('/forgot-password', methods=['POST'])
def forgot_password():
    schema = ForgotPasswordSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400

    data = schema.load(request.json)
    email = data['email']

    user = User.query.filter_by(email=email).first()
    if user:
        send_reset_email(user)

    return jsonify({'message': 'Password reset link sent'}), 200


@auth.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    user = User.query.filter_by(reset_token=token).first()
    if not user or user.reset_token_expiration < datetime.utcnow():
        return jsonify({'message': 'Invalid or expired token'}), 400

    schema = ResetPasswordSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400

    data = schema.load(request.json)
    new_password = data['new_password']

    user.set_password(new_password)
    user.reset_token = None
    user.reset_token_expiration = None
    db.session.commit()

    return jsonify({'message': 'Password reset successfully'}), 200