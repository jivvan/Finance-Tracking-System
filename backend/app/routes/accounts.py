from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import Account
from .. import db

accounts = Blueprint('accounts', __name__)


@accounts.route('/accounts', methods=['GET'])
@login_required
def get_accounts():
    accounts = Account.query.filter_by(user_id=current_user.id).all()
    return jsonify([{'id': account.id, 'name': account.name} for account in accounts])


@accounts.route('/accounts', methods=['POST'])
@login_required
def add_account():
    data = request.get_json()
    new_account = Account(name=data['name'], user_id=current_user.id)
    db.session.add(new_account)
    db.session.commit()
    return jsonify({'message': 'Account added successfully'}), 201


@accounts.route('/accounts/<int:account_id>', methods=['PUT'])
@login_required
def update_account(account_id):
    data = request.get_json()
    account = Account.query.filter_by(
        id=account_id, user_id=current_user.id).first()
    if account:
        account.name = data['name']
        db.session.commit()
        return jsonify({'message': 'Account updated successfully'}), 200
    return jsonify({'message': 'Account not found'}), 404


@accounts.route('/accounts/<int:account_id>', methods=['DELETE'])
@login_required
def delete_account(account_id):
    account = Account.query.filter_by(
        id=account_id, user_id=current_user.id).first()
    if account:
        db.session.delete(account)
        db.session.commit()
        return jsonify({'message': 'Account deleted successfully'}), 200
    return jsonify({'message': 'Account not found'}), 404
