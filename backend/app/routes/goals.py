from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, User, Goal
from ..schemas import GoalCreateSchema, GoalUpdateSchema

goals = Blueprint('goals', __name__)


def get_goal_or_404(goal_id, user_id):
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return jsonify({'message': 'Goal not found'}), 404
    return goal


@goals.route('/', methods=['GET'])
@jwt_required()
def get_goals():
    user_id = get_jwt_identity()
    goals = Goal.query.filter_by(user_id=user_id).all()
    return jsonify([{'name': g.name, 'target_amount': g.target_amount, 'current_amount': g.current_amount} for g in goals]), 200


@goals.route('/', methods=['POST'])
@jwt_required()
def create_goal():
    schema = GoalCreateSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400

    data = schema.load(request.json)
    name = data['name']
    target_amount = data['target_amount']

    user_id = get_jwt_identity()
    new_goal = Goal(name=name, target_amount=target_amount, user_id=user_id)
    db.session.add(new_goal)
    db.session.commit()

    return jsonify({'message': 'Goal created successfully'}), 201


@goals.route('/<int:goal_id>', methods=['PUT'])
@jwt_required()
def update_goal(goal_id):
    user_id = get_jwt_identity()
    goal = get_goal_or_404(goal_id, user_id)
    if isinstance(goal, tuple):
        return goal

    schema = GoalUpdateSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400

    data = schema.load(request.json)
    goal.name = data.get('name', goal.name)
    goal.target_amount = data.get('target_amount', goal.target_amount)
    goal.current_amount = data.get('current_amount', goal.current_amount)

    db.session.commit()

    return jsonify({'message': 'Goal updated successfully'}), 200


@goals.route('/<int:goal_id>', methods=['DELETE'])
@jwt_required()
def delete_goal(goal_id):
    user_id = get_jwt_identity()
    goal = get_goal_or_404(goal_id, user_id)
    if isinstance(goal, tuple):
        return goal

    db.session.delete(goal)
    db.session.commit()

    return jsonify({'message': 'Goal deleted successfully'}), 200
