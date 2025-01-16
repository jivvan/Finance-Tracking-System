from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from . import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.Text)
    accounts = db.relationship('Account', backref='owner', lazy='dynamic')
    goals = db.relationship('Goal', backref='owner', lazy='dynamic')
    categories = db.relationship('Category', backref='owner', lazy='dynamic')
    reset_token = db.Column(db.String(100), unique=True, nullable=True)
    reset_token_expiration = db.Column(db.DateTime, nullable=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    balance = db.Column(db.Float, default=0.0)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    transactions = db.relationship(
        'Transaction', backref='account', lazy='dynamic')
    __table_args__ = (
        db.UniqueConstraint('name', 'user_id', name='uix_user_account_name'),
    )


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float)
    description = db.Column(db.String(128))
    date = db.Column(db.DateTime, default=datetime.utcnow)
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    limit = db.Column(db.Float, default=0.0)
    category_type = db.Column(db.String(7), default='expense')
    transactions = db.relationship(
        'Transaction', backref='category', lazy='dynamic')

    __table_args__ = (
        db.UniqueConstraint('name', 'user_id', name='uix_user_category_name'),
    )


class Goal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    target_amount = db.Column(db.Float)
    current_amount = db.Column(db.Float, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    contributions = db.relationship(
        'Contribution', backref='goal', lazy='dynamic')


class Contribution(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'))
    goal_id = db.Column(db.Integer, db.ForeignKey('goal.id'))
