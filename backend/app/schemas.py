from marshmallow import Schema, fields, validate

class TransactionSchema(Schema):
    id = fields.Integer()
    amount = fields.Float()
    description = fields.String()
    account_id = fields.Integer()
    date = fields.Date()
    category_id = fields.Integer()

class AccountSchema(Schema):
    id = fields.Integer()
    name = fields.String()
    balance = fields.Float()
    user_id = fields.Integer()
    transactions = fields.Nested(TransactionSchema, many=True)

class GoalSchema(Schema):
    id = fields.Int(dump_only=True)  # Read-only field
    name = fields.Str(required=True, validate=validate.Length(min=1, max=64))
    target_amount = fields.Float(required=True, validate=validate.Range(min=0))
    current_amount = fields.Float(dump_only=True)  # Read-only field
    user_id = fields.Int(dump_only=True)  # Read-only field
    created_at = fields.DateTime(dump_only=True)  # Read-only field
    updated_at = fields.DateTime(dump_only=True)  # Read-only field

class UserRegisterSchema(Schema):
    username = fields.Str(
        required=True, validate=validate.Length(min=4, max=64))
    email = fields.Email(required=True)
    password = fields.Str(
        required=True, validate=validate.Length(min=8, max=128))


class ResetPasswordSchema(Schema):
    new_password = fields.Str(required=True, validate=validate.Length(min=6))

class UserLoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True)


class ForgotPasswordSchema(Schema):
    email = fields.Email(required=True)


class AccountCreateSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=64))
    balance = fields.Float(required=True)


class AccountUpdateSchema(Schema):
    name = fields.Str(validate=validate.Length(min=1, max=64))
    balance = fields.Float()


class TransactionCreateSchema(Schema):
    amount = fields.Float(required=True)
    description = fields.Str(required=True, validate=validate.Length(max=128))
    account_id = fields.Int(required=True)
    category_id = fields.Int(required=True)
    date = fields.DateTime(required=True, format="%Y-%m-%d %H:%M:%S")


class TransactionUpdateSchema(Schema):
    amount = fields.Float()
    description = fields.Str(validate=validate.Length(min=1, max=128))
    account_id = fields.Int()
    category_id = fields.Int()


class GoalCreateSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=64))
    target_amount = fields.Float(required=True)


class GoalUpdateSchema(Schema):
    name = fields.Str(validate=validate.Length(min=1, max=64))
    target_amount = fields.Float()


class SpendingLimitCreateSchema(Schema):
    limit_amount = fields.Float(required=True)
    category_id = fields.Int(required=True)


class SpendingLimitUpdateSchema(Schema):
    limit_amount = fields.Float()
    category_id = fields.Int(required=True)


class ContributionCreateSchema(Schema):
    amount = fields.Float(required=True)
    account_id = fields.Int(required=True)
    goal_id = fields.Int(required=True)


class ContributionUpdateSchema(Schema):
    amount = fields.Float()
    account_id = fields.Int()


class CategoryCreateSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=3, max=64))
    category_type = fields.Str(required=True)
    limit = fields.Float()


class CategoryUpdateSchema(Schema):
    name = fields.Str(validate=validate.Length(min=3, max=64))
    category_type = fields.Str()
    limit = fields.Float()


class PredictionSchema(Schema):
    category_id = fields.Int()
    num_periods = fields.Int()
    lookback = fields.Int()
