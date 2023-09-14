from marshmallow import fields, Schema


class GetSlackInstallationRequestSchema(Schema):
    team_id = fields.Str()


class GetSlackInstallationResponseSchema(Schema):
    team_id = fields.Str(required=True)
    team_name = fields.Str()
    enterprise_id = fields.Str()
    enterprise_name = fields.Str()
    app_id = fields.Str(required=True)
    bot_user_id = fields.Str(required=True)
    access_token = fields.Str(required=True)
    channel_id = fields.Str(required=True)
