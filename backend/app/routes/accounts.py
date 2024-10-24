from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, User, Account
from ..schemas import AccountCreateSchema

accounts = Blueprint('accounts', __name__)


@accounts.route('/', methods=['GET'])
@jwt_required()
def get_accounts():
    user_id = get_jwt_identity()
    accounts = Account.query.filter_by(user_id=user_id).all()
    return jsonify([account.name for account in accounts]), 200


@accounts.route('/', methods=['POST'])
@jwt_required()
def create_account():
    schema = AccountCreateSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400

    data = schema.load(request.json)
    name = data['name']
    balance = data['balance']

    user_id = get_jwt_identity()
    new_account = Account(name=name, balance=balance, user_id=user_id)
    db.session.add(new_account)
    db.session.commit()

    return jsonify({'message': 'Account created successfully'}), 201
