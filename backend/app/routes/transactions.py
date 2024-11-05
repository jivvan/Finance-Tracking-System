import pandas as pd
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from datetime import timedelta, datetime
from ..utils import jwt_required_user_exists, arima_predict
from ..models import db, User, Account, Transaction, Category
from ..schemas import TransactionCreateSchema, TransactionUpdateSchema, PredictionSchema
from sqlalchemy import func

transactions = Blueprint('transactions', __name__)


@transactions.route('/', methods=['GET'])
@jwt_required_user_exists
def get_transactions():
    user_id = get_jwt_identity()

    # Get pagination parameters from query string
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)

    # Fetch paginated transactions
    accounts = Account.query.filter_by(user_id=user_id).all()
    account_ids = [account.id for account in accounts]
    transactions_query = Transaction.query.filter(
        Transaction.account_id.in_(account_ids)).order_by(Transaction.date.desc())
    paginated_transactions = transactions_query.paginate(
        page=page, per_page=per_page, error_out=False)

    # Prepare the response
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

    # Include pagination metadata in the response
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


@transactions.route('/predict', methods=['POST'])
@jwt_required_user_exists
def predict_spending():
    user_id = get_jwt_identity()
    schema = PredictionSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400

    data = schema.load(request.json)
    category_id = data.get('category_id')
    num_periods = data.get('num_periods', 1)
    lookback = data.get('lookback', 30)

    accounts = Account.query.filter_by(user_id=user_id).all()
    account_ids = [account.id for account in accounts]

    duration_end = datetime.today()
    duration_begin = duration_end - timedelta(days=lookback)

    if category_id:
        transactions = db.session.query(
            func.date(Transaction.date).label('date'),
            func.sum(Transaction.amount).label('amount')
        ).filter(
            Transaction.account_id.in_(account_ids),
            Transaction.category_id == category_id,
            Transaction.date >= duration_begin,
            Transaction.date <= duration_end
        ).group_by(
            func.date(Transaction.date)
        ).all()
    else:
        categories = Category.query.filter_by(user_id=user_id).all()
        expense_categories = [
            cat.id for cat in categories if cat.category_type == 'expense']
        # transactions = Transaction.query.filter(
        #     Transaction.account_id.in_(account_ids),
        #     Transaction.category_id.in_(expense_categories),
        #     Transaction.date >= duration_begin,
        #     Transaction.date <= duration_end
        # ).order_by(Transaction.date.desc()).all()
        transactions = db.session.query(
            func.date(Transaction.date).label('date'),
            func.sum(Transaction.amount).label('amount')
        ).filter(
            Transaction.account_id.in_(account_ids),
            Transaction.category_id.in_(expense_categories),
            Transaction.date >= duration_begin,
            Transaction.date <= duration_end
        ).group_by(
            func.date(Transaction.date)
        ).all()

    if not transactions:
        return jsonify({'message': 'No transactions found for the specified category'}), 404
    if len(transactions) <= 1:
        return jsonify({'message': f'Not enough transactions to make forecast: {len(transactions)}'}), 400

    expenses = [{'date': t.date, 'amount': t.amount} for t in transactions]
    return jsonify({
        'historical': {item["date"].strftime("%Y-%m-%d"): item["amount"] for item in expenses},
        'forecast': arima_predict(expenses, num_periods)
    })
