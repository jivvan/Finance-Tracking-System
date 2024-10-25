from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, User, Account, Goal, Contribution
from ..schemas import ContributionCreateSchema, ContributionUpdateSchema

contributions = Blueprint('contributions', __name__)


@contributions.route('/', methods=['GET'])
@jwt_required()
def get_contributions():
    user_id = get_jwt_identity()
    goal_id = request.json.get('goal_id', None)
    if not goal_id:
        return jsonify({'message': 'Goal ID is required'})
    contributions = Contribution.query.filter_by(goal_id=goal_id)
    return jsonify([{'id': c.id, 'amount': c.amount, 'date': c.date, 'account_id': c.account_id, 'goal_id': c.goal_id} for c in contributions]), 200


@contributions.route('/', methods=['POST'])
@jwt_required()
def create_contribution():
    schema = ContributionCreateSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400

    data = schema.load(request.json)
    amount = data['amount']
    account_id = data['account_id']
    goal_id = data['goal_id']

    user_id = get_jwt_identity()
    account = Account.query.filter_by(id=account_id, user_id=user_id).first()
    if not account:
        return jsonify({'message': 'Account not found'}), 404

    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return jsonify({'message': 'Goal not found'}), 404

    if account.balance < amount:
        return jsonify({'message': 'Insufficient balance in the account'}), 400

    new_contribution = Contribution(
        amount=amount, account_id=account_id, goal_id=goal_id)
    db.session.add(new_contribution)

    account.balance -= amount
    goal.current_amount += amount

    db.session.commit()

    return jsonify({'message': 'Contribution created successfully'}), 201


@contributions.route('/<int:contribution_id>', methods=['PUT'])
@jwt_required()
def update_contribution(contribution_id):
    schema = ContributionUpdateSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400

    data = schema.load(request.json)
    amount = data.get('amount')
    account_id = data.get('account_id')

    user_id = get_jwt_identity()
    contribution = Contribution.query.filter_by(
        id=contribution_id, account_id=Account.id).first()
    if not contribution:
        return jsonify({'message': 'Contribution not found'}), 404

    if amount is not None:
        # Adjust the account and goal balances
        account = Account.query.filter_by(
            id=contribution.account_id, user_id=user_id).first()
        goal = Goal.query.filter_by(
            id=contribution.goal_id, user_id=user_id).first()

        account.balance += contribution.amount
        goal.current_amount -= contribution.amount

        if account.balance < amount:
            return jsonify({'message': 'Insufficient balance in the account'}), 400

        account.balance -= amount
        goal.current_amount += amount

        contribution.amount = amount

    if account_id is not None:
        account = Account.query.filter_by(
            id=account_id, user_id=user_id).first()
        if not account:
            return jsonify({'message': 'Account not found'}), 404
        contribution.account_id = account_id

    db.session.commit()

    return jsonify({'message': 'Contribution updated successfully'}), 200


@contributions.route('/<int:contribution_id>', methods=['DELETE'])
@jwt_required()
def delete_contribution(contribution_id):
    user_id = get_jwt_identity()
    contribution = Contribution.query.filter_by(
        id=contribution_id, account_id=Account.id, account=Account.query.filter_by(user_id=user_id).subquery()).first()
    if not contribution:
        return jsonify({'message': 'Contribution not found'}), 404

    account = Account.query.filter_by(
        id=contribution.account_id, user_id=user_id).first()
    goal = Goal.query.filter_by(
        id=contribution.goal_id, user_id=user_id).first()

    account.balance += contribution.amount
    goal.current_amount -= contribution.amount

    db.session.delete(contribution)
    db.session.commit()

    return jsonify({'message': 'Contribution deleted successfully'}), 200
