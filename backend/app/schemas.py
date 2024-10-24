from marshmallow import Schema, fields, validate


class UserRegisterSchema(Schema):
    username = fields.Str(
        required=True, validate=validate.Length(min=4, max=64))
    email = fields.Email(required=True)
    password = fields.Str(
        required=True, validate=validate.Length(min=8, max=128))


class UserLoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True)


class ForgotPasswordSchema(Schema):
    email = fields.Email(required=True)


class AccountCreateSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=64))
    balance = fields.Float(required=True)


class TransactionCreateSchema(Schema):
    amount = fields.Float(required=True)
    description = fields.Str(
        required=True, validate=validate.Length(min=1, max=128))
    account_id = fields.Int(required=True)
    category_id = fields.Int(required=True)


class GoalCreateSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=64))
    target_amount = fields.Float(required=True)


class SpendingLimitCreateSchema(Schema):
    limit_amount = fields.Float(required=True)
    category_id = fields.Int(required=True)
