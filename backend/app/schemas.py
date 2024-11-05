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


class AccountUpdateSchema(Schema):
    name = fields.Str(validate=validate.Length(min=1, max=64))
    balance = fields.Float()


class TransactionCreateSchema(Schema):
    amount = fields.Float(required=True)
    description = fields.Str(
        required=True, validate=validate.Length(min=1, max=128))
    account_id = fields.Int(required=True)
    category_id = fields.Int(required=True)


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
