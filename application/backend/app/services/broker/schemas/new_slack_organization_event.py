from marshmallow import fields, Schema

class NewSlackOrganizationEventSchema(Schema):
    team_id = fields.Str(required=True)
    bot_token = fields.Str(required=True)
    user_who_installed = fields.Str(required=True)
