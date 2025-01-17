import pandas as pd
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from ..utils import jwt_required_user_exists, description_to_bert_embedding, rf_model
from ..models import db, User, Account, Transaction, Category
from ..schemas import TransactionCreateSchema, TransactionUpdateSchema, PredictionSchema

transactions = Blueprint('transactions', __name__)

@transactions.route('/', methods=['GET'])
@jwt_required_user_exists
def get_transactions():
    user_id = get_jwt_identity()

    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)
    search_term = request.args.get('search_term', default=None, type=str)

    accounts = Account.query.filter_by(user_id=user_id).all()
    account_ids = [account.id for account in accounts]

    transactions_query = Transaction.query.filter(
        Transaction.account_id.in_(account_ids)
    )

    if search_term:
        transactions_query = transactions_query.filter(
            Transaction.description.ilike(f'%{search_term}%')
        )

    transactions_query = transactions_query.order_by(Transaction.date.desc())
    paginated_transactions = transactions_query.paginate(
        page=page, per_page=per_page, error_out=False
    )

    transactions_list = [
        {
            'id': t.id,
            'amount': t.amount,
            'description': t.description,
            'date': t.date,
            'account_id': t.account_id,
            'category_id': t.category_id
        }
        for t in paginated_transactions.items
    ]

    response = {
        'transactions': transactions_list,
        'pagination': {
            'page': paginated_transactions.page,
            'per_page': paginated_transactions.per_page,
            'total_pages': paginated_transactions.pages,
            'total_items': paginated_transactions.total,
            'has_next': paginated_transactions.has_next,
            'has_prev': paginated_transactions.has_prev,
            'next_page': paginated_transactions.next_num if paginated_transactions.has_next else None,
            'prev_page': paginated_transactions.prev_num if paginated_transactions.has_prev else None
        }
    }

    return jsonify(response), 200

@transactions.route('/', methods=['POST'])
@jwt_required_user_exists
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
    date = data['date'] 

    user_id = get_jwt_identity()
    account = Account.query.filter_by(id=account_id, user_id=user_id).first()
    if not account:
        return jsonify({'message': 'Account not found'}), 404

    category = Category.query.filter_by(id=category_id, user_id=user_id).first()
    if not category:
        return jsonify({'message': 'Category not found'}), 404

    new_transaction = Transaction(
        amount=amount,
        description=description,
        account_id=account_id,
        category_id=category_id,
        date=date 
    )

    account.balance += amount

    db.session.add(new_transaction)
    db.session.commit()

    return jsonify({'message': 'Transaction created successfully'}), 201


@transactions.route('/<int:transaction_id>', methods=['PUT'])
@jwt_required_user_exists
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

    previous_account = Account.query.filter_by(
        id=transaction.account_id).first()
    if previous_account:
        previous_account.balance -= transaction.amount

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

    new_account = Account.query.filter_by(id=transaction.account_id).first()
    if new_account:
        new_account.balance += transaction.amount

    db.session.commit()

    return jsonify({'message': 'Transaction updated successfully'}), 200


@transactions.route('/<int:transaction_id>', methods=['DELETE'])
@jwt_required_user_exists
def delete_transaction(transaction_id):
    transaction = Transaction.query.filter_by(id=transaction_id).first()
    if not transaction:
        return jsonify({'message': 'Transaction not found'}), 404

    account = Account.query.filter_by(id=transaction.account_id).first()
    if account:
        account.balance -= transaction.amount

    db.session.delete(transaction)
    db.session.commit()

    return jsonify({'message': 'Transaction deleted successfully'}), 200

@transactions.route('/predict_category', methods=['POST'])
def predict_category():
    data = request.json
    description = data.get('description')

    if not description:
        return jsonify({'error': 'Description is required'}), 400

    description_embedding = description_to_bert_embedding(description)
    description_embedding = description_embedding.reshape(1, -1) 

    predicted_category = rf_model.predict(description_embedding)

    return jsonify({'predicted_category': predicted_category[0]}), 200