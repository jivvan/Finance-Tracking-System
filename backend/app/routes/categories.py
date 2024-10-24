from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, User, Category

categories = Blueprint('categories', __name__)


@categories.route('/', methods=['GET'])
@jwt_required()
def get_categories():
    user_id = get_jwt_identity()
    categories = Category.query.filter_by(user_id=user_id).all()
    return jsonify([category.name for category in categories]), 200


@categories.route('/', methods=['POST'])
@jwt_required()
def create_category():
    user_id = get_jwt_identity()
    data = request.get_json()
    name = data.get('name')

    new_category = Category(name=name, user_id=user_id)
    db.session.add(new_category)
    db.session.commit()

    return jsonify({'message': 'Category created successfully'}), 201
