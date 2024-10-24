from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, User, Goal
from ..schemas import GoalCreateSchema

goals = Blueprint('goals', __name__)


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
