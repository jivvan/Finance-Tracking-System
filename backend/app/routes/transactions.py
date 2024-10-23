from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import Transaction, Account
from .. import db

transactions = Blueprint('transactions', __name__)


@transactions.route('/transactions', methods=['GET'])
@login_required
def get_transactions():
    transactions = Transaction.query.filter_by(user_id=current_user.id).all()
    return jsonify([transaction.to_dict() for transaction in transactions])


@transactions.route('/transactions', methods=['POST'])
@login_required
def add_transaction():
    data = request.get_json()
    account = Account.query.filter_by(
        id=data['account_id'], user_id=current_user.id).first()
    if not account:
        return jsonify({'message': 'Account not found'}), 404

    category = 'test'  # Replace with actual categorization logic
    new_transaction = Transaction(
        description=data['description'],
        amount=data['amount'],
        category=category,
        account_id=data['account_id'],
        user_id=current_user.id
    )
    db.session.add(new_transaction)

    # Update account balance
    account.balance += data['amount']

    db.session.commit()
    return jsonify(new_transaction.to_dict()), 201
