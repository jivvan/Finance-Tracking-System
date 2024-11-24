from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from ..utils import jwt_required_user_exists
from ..models import db, Category
from ..schemas import CategoryCreateSchema, CategoryUpdateSchema

categories = Blueprint('categories', __name__)


def get_category_or_404(category_id, user_id):
    category = Category.query.filter_by(
        id=category_id, user_id=user_id).first()
    if not category:
        return jsonify({'message': 'Category not found'}), 404
    return category


@categories.route('/', methods=['GET'])
@jwt_required_user_exists
def get_categories():
    user_id = get_jwt_identity()
    categories = Category.query.filter_by(user_id=user_id).all()
    return jsonify([{'name': category.name, 'limit': category.limit,
                     'id': category.id, 'category_type': category.category_type} for category in categories]), 200


@categories.route('/', methods=['POST'])
@jwt_required_user_exists
def create_category():
    user_id = get_jwt_identity()
    schema = CategoryCreateSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400
    data = schema.load(request.json)
    name = data['name']
    limit = data.get('limit', 0)
    category_type = data['category_type']
    if category_type not in ['income', 'expense']:
        return jsonify({'category_type': 'Invalid category type'})
    if not name:
        return jsonify({'name': 'Invalid category name'}), 400

    exists = Category.query.filter_by(user_id=user_id, name=name).first()
    if exists:
        return jsonify({'message': 'Category with same name already exists'})

    new_category = Category(name=name, user_id=user_id,
                            category_type=category_type, limit=limit)
    db.session.add(new_category)
    db.session.commit()

    return jsonify({'message': 'Category created successfully'}), 201


@categories.route('/<int:category_id>', methods=['PUT'])
@jwt_required_user_exists
def update_category(category_id):
    user_id = get_jwt_identity()
    category = get_category_or_404(category_id, user_id)
    if isinstance(category, tuple):
        return category

    schema = CategoryUpdateSchema()
    errors = schema.validate(request.json)
    if errors:
        return jsonify(errors), 400
    data = schema.load(request.json)

    name = data.get('name', category.name)
    limit = data.get('limit', category.limit)
    category_type = data.get('category_type', category.category_type)
    if not name:
        return jsonify({'name': 'Invalid category name'}), 400
    if category_type not in ['income', 'expense']:
        return jsonify({'category_type', 'Invalid category type'})
    category.name = name
    category.limit = limit
    category.category_type = category_type
    db.session.commit()

    return jsonify({'message': 'Category updated successfully'}), 200


@categories.route('/<int:category_id>', methods=['DELETE'])
@jwt_required_user_exists
def delete_category(category_id):
    user_id = get_jwt_identity()
    category = get_category_or_404(category_id, user_id)
    if isinstance(category, tuple):
        return category

    db.session.delete(category)
    db.session.commit()

    return jsonify({'message': 'Category deleted successfully'}), 200
