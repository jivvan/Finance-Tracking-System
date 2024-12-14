from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from collections import defaultdict
from ..utils import jwt_required_user_exists, arima_predict
from ..models import db, User, Account, Transaction, Category, Goal, Contribution
from datetime import datetime, timedelta
from ..schemas import TransactionSchema
from datetime import timedelta, datetime
from sqlalchemy import func


dashboard = Blueprint('dashboard', __name__)

@dashboard.route('/', methods=['GET'])
@jwt_required_user_exists
def get_dashboard_data():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    account_id = request.args.get('account_id', None)

    if account_id:
        account = Account.query.filter_by(id=account_id, user_id=user_id).first()
        if not account:
            return jsonify({'message': 'Account not found'}), 404
        accounts = [account]
    else:
        accounts = user.accounts

    # 1. Current Balance
    current_balance = sum(account.balance for account in accounts)

    # 2. Past 30 Day Expense
    past_30_days = datetime.utcnow() - timedelta(days=30)
    past_30_day_expense = sum(
        transaction.amount for account in accounts for transaction in account.transactions.filter(
            Transaction.date >= past_30_days,
            Transaction.amount < 0
        ).all()
    )

    # 3. Past 30 Day Income
    past_30_day_income = sum(
        transaction.amount for account in accounts for transaction in account.transactions.filter(
            Transaction.date >= past_30_days,
            Transaction.amount > 0
        ).all()
    )

    # 4. Financial Overview of Last 6 Months (Income/Expense of Each Month)
    financial_overview = []
    for i in range(6):
        start_date = datetime.utcnow() - timedelta(days=30 * (i + 1))
        end_date = datetime.utcnow() - timedelta(days=30 * i)
        month_income = sum(
            transaction.amount for account in accounts for transaction in account.transactions.filter(
                Transaction.date >= start_date,
                Transaction.date < end_date,
                Transaction.amount > 0
            ).all()
        )
        month_expense = sum(
            transaction.amount for account in accounts for transaction in account.transactions.filter(
                Transaction.date >= start_date,
                Transaction.date < end_date,
                Transaction.amount < 0
            ).all()
        )
        financial_overview.append({
            'month': start_date.strftime('%B %Y'),
            'income': month_income,
            'expense': month_expense
        })

    # 5. Expense Breakdown by Category for Last Month
    last_month_start = datetime.utcnow() - timedelta(days=30)
    expense_breakdown = {}
    for category in user.categories:
        category_expenses = sum(
            transaction.amount for account in accounts for transaction in account.transactions.filter(
                Transaction.date >= last_month_start,
                Transaction.amount < 0,
                Transaction.category_id == category.id
            ).all()
        )
        if category_expenses:
            expense_breakdown[category.name] = category_expenses
    
    # 6. Recent 5 transactions
    recent_transactions = []
    for account in accounts:
        recent_transactions.extend(
            account.transactions.order_by(Transaction.date.desc()).limit(5).all()
        )
    recent_transactions = sorted(recent_transactions, key=lambda t: t.date, reverse=True)[:5]
    serialized_recent_transactions = TransactionSchema(many=True).dump(recent_transactions)


    # 7. Finance Calendar (Last 30 Days)
    finance_calendar = defaultdict(lambda: {'income': 0, 'expense': 0})

    # Calculate the start date for the last 30 days
    start_date = datetime.utcnow() - timedelta(days=90)

    # Iterate through transactions for the last 30 days in descending order
    for account in accounts:
        for transaction in account.transactions.filter(Transaction.date >= start_date).order_by(Transaction.date.desc()).all():
            date = transaction.date.date()
            amount = transaction.amount
            if amount > 0:
                finance_calendar[date]['income'] += amount
            else:
                finance_calendar[date]['expense'] += amount

    finance_calendar = [{'date': date, **data} for date, data in sorted(finance_calendar.items(), reverse=True)]

 
    return jsonify({
        'current_balance': current_balance,
        'past_30_day_expense': past_30_day_expense,
        'past_30_day_income': past_30_day_income,
        'financial_overview': financial_overview,
        'expense_breakdown': expense_breakdown,
        'recent_transactions': serialized_recent_transactions,
        'prediction': predict_spending(user_id, account_id),
        'calendar': finance_calendar
    }), 200



def predict_spending(user_id, account_id=None):
    num_periods = 30
    lookback = 30

    accounts = Account.query.filter_by(user_id=user_id).all()
    if account_id:
        account_ids = [account_id]
    else:
        account_ids = [account.id for account in accounts]

    duration_end = datetime.today()
    duration_begin = duration_end - timedelta(days=lookback)

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
        return {'message': 'No transactions found for the specified category'}
    if len(transactions) <= 1:
        return {'message': f'Not enough transactions to make forecast: {len(transactions)}'}

    num_periods = min(len(transactions), 30)
    expenses = [{'date': t.date, 'amount': t.amount} for t in transactions]
    return {
        'historical': {item["date"].strftime("%Y-%m-%d"): item["amount"] for item in expenses},
        'forecast': arima_predict(expenses, num_periods)
    }
