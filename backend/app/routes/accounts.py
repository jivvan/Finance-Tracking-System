from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from ..utils import jwt_required_user_exists
from ..models import db, Account
from ..schemas import AccountCreateSchema, AccountUpdateSchema, AccountSchema

accounts = Blueprint('accounts', __name__)


def get_account_or_404(account_id, user_id):
    account = Account.query.filter_by(id=account_id, user_id=user_id).first()
    if not account:
        return jsonify({'message': 'Account not found'}), 404
    return account


@accounts.route('/', methods=['GET'])
@jwt_required_user_exists
def get_accounts():
    user_id = get_jwt_identity()
    accounts = Account.query.filter_by(user_id=user_id).all()
    return jsonify([AccountSchema().dump(account) for account in accounts]), 200


@accounts.route('/', methods=['POST'])
@jwt_required_user_exists
def create_account():
    user_id = get_jwt_identity()
    schema = AccountCreateSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400

    data = schema.load(request.json)
    name = data['name']
    balance = data['balance']

    exists = Account.query.filter_by(name=name, user_id=user_id).first()
    if exists:
        return jsonify({'message': "Account with same name already exists"}), 400

    new_account = Account(name=name, balance=balance, user_id=user_id)
    db.session.add(new_account)
    db.session.commit()

    # Serialize the newly created account
    serialized_account = AccountSchema().dump(new_account)

    return jsonify({
        'message': 'Account created successfully',
        'account': serialized_account
    }), 201


@accounts.route('/<int:account_id>', methods=['PUT'])
@jwt_required_user_exists
def update_account(account_id):
    user_id = get_jwt_identity()
    account = get_account_or_404(account_id, user_id)
    if isinstance(account, tuple):
        return account

    schema = AccountUpdateSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400

    data = schema.load(request.json)
    account.name = data.get('name', account.name)
    account.balance = data.get('balance', account.balance)

    db.session.commit()

    return jsonify({'message': 'Account updated successfully'}), 200


@accounts.route('/<int:account_id>', methods=['DELETE'])
@jwt_required_user_exists
def delete_account(account_id):
    user_id = get_jwt_identity()
    account = get_account_or_404(account_id, user_id)
    if isinstance(account, tuple):
        return account

    db.session.delete(account)
    db.session.commit()

    return jsonify({'message': 'Account deleted successfully'}), 200
