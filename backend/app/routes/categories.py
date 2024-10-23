from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import Category
from .. import db

categories = Blueprint('categories', __name__)


@categories.route('/categories', methods=['GET'])
@login_required
def get_categories():
    categories = Category.query.filter_by(user_id=current_user.id).all()
    return jsonify([{'id': category.id, 'name': category.name} for category in categories])


@categories.route('/categories', methods=['POST'])
@login_required
def add_category():
    data = request.get_json()
    new_category = Category(name=data['name'], user_id=current_user.id)
    db.session.add(new_category)
    db.session.commit()
    return jsonify({'message': 'Category added successfully'}), 201


@categories.route('/categories/<int:category_id>', methods=['PUT'])
@login_required
def update_category(category_id):
    data = request.get_json()
    category = Category.query.filter_by(
        id=category_id, user_id=current_user.id).first()
    if category:
        category.name = data['name']
        db.session.commit()
        return jsonify({'message': 'Category updated successfully'}), 200
    return jsonify({'message': 'Category not found'}), 404


@categories.route('/categories/<int:category_id>', methods=['DELETE'])
@login_required
def delete_category(category_id):
    category = Category.query.filter_by(
        id=category_id, user_id=current_user.id).first()
    if category:
        db.session.delete(category)
        db.session.commit()
        return jsonify({'message': 'Category deleted successfully'}), 200
    return jsonify({'message': 'Category not found'}), 404
