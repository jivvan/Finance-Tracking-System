from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import User, Friend
from .. import db

friends = Blueprint('friends', __name__)


@friends.route('/friends', methods=['POST'])
@login_required
def add_friend():
    data = request.get_json()
    friend = User.query.filter_by(username=data['username']).first()
    if friend and friend.id != current_user.id:
        new_friend = Friend(user_id=current_user.id, friend_id=friend.id)
        db.session.add(new_friend)
        db.session.commit()
        return jsonify({'message': 'Friend added successfully'}), 201
    return jsonify({'message': 'Invalid friend username'}), 400
