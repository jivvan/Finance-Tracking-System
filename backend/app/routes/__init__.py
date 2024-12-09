from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from ..utils import jwt_required_user_exists
from ..models import db, User, Account, Transaction, Category, Goal, Contribution
from datetime import datetime, timedelta

dashboard = Blueprint('dashboard', __name__)

@dashboard.route('/', methods=['GET'])
@jwt_required_user_exists
def get_dashboard_data():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    account_id = request.args.get('account_id')

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

    return jsonify({
        'current_balance': current_balance,
        'past_30_day_expense': past_30_day_expense,
        'past_30_day_income': past_30_day_income,
        'financial_overview': financial_overview,
        'expense_breakdown': expense_breakdown
    }), 200