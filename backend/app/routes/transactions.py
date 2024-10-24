from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, User, Account, Transaction, Category
from ..schemas import TransactionCreateSchema

transactions = Blueprint('transactions', __name__)


@transactions.route('/', methods=['GET'])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()
    accounts = Account.query.filter_by(user_id=user_id).all()
    transactions = []
    for account in accounts:
        transactions.extend(account.transactions.all())
    return jsonify([{'amount': t.amount, 'description': t.description, 'date': t.date} for t in transactions]), 200


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
    db.session.add(new_transaction)
    db.session.commit()

    return jsonify({'message': 'Transaction created successfully'}), 201
