from flask import Blueprint, jsonify, request
from flask_login import login_user, login_required, logout_user, current_user
from ..models import User
from ..forms import RegistrationForm, LoginForm
from .. import db, csrf
from flask_wtf.csrf import generate_csrf

auth = Blueprint('auth', __name__)


@auth.route('/get-csrf-token', methods=['GET'])
def get_csrf_token():
    token = generate_csrf()
    return jsonify({'csrf_token': token})


@auth.route('/register', methods=['POST'])
def register():
    form = RegistrationForm(request.form)
    if form.validate():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    return jsonify({'errors': form.errors}), 400


@auth.route('/login', methods=['POST'])
def login():
    form = LoginForm(request.form)
    if form.validate():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            return jsonify({'message': 'Logged in successfully'}), 200
        return jsonify({'message': 'Invalid email or password'}), 401
    return jsonify({'errors': form.errors}), 400


@auth.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200
