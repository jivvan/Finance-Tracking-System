from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import Transaction, SplitBill, User
from .. import db, socketio

split_bills = Blueprint('split_bills', __name__)


@split_bills.route('/split-bill', methods=['POST'])
@login_required
def split_bill():
    data = request.get_json()
    transaction = Transaction(
        description=data['description'],
        amount=sum(amount for _, amount in data['splits']),
        category='split',
        user_id=current_user.id
    )
    db.session.add(transaction)
    db.session.commit()

    for username, amount in data['splits']:
        friend = User.query.filter_by(username=username).first()
        if friend:
            split_bill = SplitBill(
                transaction_id=transaction.id,
                user_id=friend.id,
                amount=amount
            )
            db.session.add(split_bill)
            socketio.emit('notification', {'message': f'You have a new split bill from {
                          current_user.username}'}, room=friend.id)
    db.session.commit()
    return jsonify({'message': 'Bill split successfully'}), 201
