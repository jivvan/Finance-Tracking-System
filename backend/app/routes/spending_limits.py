from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, User, Category, SpendingLimit
from ..schemas import SpendingLimitCreateSchema

spending_limits = Blueprint('spending_limits', __name__)


@spending_limits.route('/', methods=['GET'])
@jwt_required()
def get_spending_limits():
    user_id = get_jwt_identity()
    limits = SpendingLimit.query.filter_by(user_id=user_id).all()
    return jsonify([{'limit_amount': l.limit_amount, 'category_id': l.category_id} for l in limits]), 200


@spending_limits.route('/', methods=['POST'])
@jwt_required()
def create_spending_limit():
    schema = SpendingLimitCreateSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400

    data = schema.load(request.json)
    limit_amount = data['limit_amount']
    category_id = data['category_id']

    user_id = get_jwt_identity()
    category = Category.query.filter_by(
        id=category_id, user_id=user_id).first()
    if not category:
        return jsonify({'message': 'Category not found'}), 404

    new_limit = SpendingLimit(
        limit_amount=limit_amount, category_id=category_id, user_id=user_id)
    db.session.add(new_limit)
    db.session.commit()

    return jsonify({'message': 'Spending limit created successfully'}), 201
