from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, User, Account, Transaction, Category
from ..schemas import TransactionCreateSchema, TransactionUpdateSchema

transactions = Blueprint('transactions', __name__)


@transactions.route('/', methods=['GET'])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()
    accounts = Account.query.filter_by(user_id=user_id).all()
    transactions = []
    for account in accounts:
        transactions.extend(account.transactions.all())
    return jsonify([{'id': t.id, 'amount': t.amount, 'description': t.description, 'date': t.date, 'account_id': t.account_id, 'category_id': t.category_id} for t in transactions]), 200


@transactions.route('/', methods=['POST'])
@jwt_required()
def create_transaction():
    schema = TransactionCreateSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400

    data = schema.load(request.json)
    amount = data['amount']
    description = data['description']
    account_id = data['account_id']
    category_id = data['category_id']

    user_id = get_jwt_identity()
    account = Account.query.filter_by(id=account_id, user_id=user_id).first()
    if not account:
        return jsonify({'message': 'Account not found'}), 404

    category = Category.query.filter_by(
        id=category_id, user_id=user_id).first()
    if not category:
        return jsonify({'message': 'Category not found'}), 404

    new_transaction = Transaction(
        amount=amount, description=description, account_id=account_id, category_id=category_id)
    account.balance += amount
    db.session.add(new_transaction)
    db.session.commit()

    return jsonify({'message': 'Transaction created successfully'}), 201


@transactions.route('/<int:transaction_id>', methods=['PUT'])
@jwt_required()
def update_transaction(transaction_id):
    schema = TransactionUpdateSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400

    data = schema.load(request.json)
    amount = data.get('amount')
    description = data.get('description')
    account_id = data.get('account_id')
    category_id = data.get('category_id')

    user_id = get_jwt_identity()
    transaction = Transaction.query.filter_by(id=transaction_id).first()
    if not transaction:
        return jsonify({'message': 'Transaction not found'}), 404

    # TODO: can we not just use transaction's existing data as fallback?
    if amount is not None:
        transaction.amount = amount
    if description is not None:
        transaction.description = description
    if account_id is not None:
        account = Account.query.filter_by(
            id=account_id, user_id=user_id).first()
        if not account:
            return jsonify({'message': 'Account not found'}), 404
        transaction.account_id = account_id
    if category_id is not None:
        category = Category.query.filter_by(
            id=category_id, user_id=user_id).first()
        if not category:
            return jsonify({'message': 'Category not found'}), 404
        transaction.category_id = category_id

    db.session.commit()

    return jsonify({'message': 'Transaction updated successfully'}), 200


@transactions.route('/<int:transaction_id>', methods=['DELETE'])
@jwt_required()
def delete_transaction(transaction_id):
    user_id = get_jwt_identity()
    transaction = Transaction.query.filter_by(
        id=transaction_id, account_id=Account.id, account=Account.query.filter_by(user_id=user_id).subquery()).first()
    if not transaction:
        return jsonify({'message': 'Transaction not found'}), 404

    db.session.delete(transaction)
    db.session.commit()

    return jsonify({'message': 'Transaction deleted successfully'}), 200
