from marshmallow import fields, Schema
from src.rsvp import RSVP
from marshmallow_enum import EnumField

class GetScheduledEventsForUserRequestSchema(Schema):
    user_id = fields.Str(required=True)
    team_id = fields.Str(required=True)

  
class ScheduledEventsForUserDataSchema(Schema):
    event_id = fields.UUID(required=True)
    resturant_id = fields.UUID(required=True)
    time = fields.Str(required=True)
    responded = EnumField(RSVP, by_value=True, required=True)
    event_finalized = fields.Bool(required=True)

class GetScheduledEventsForUserResponseSchema(Schema):
    events = fields.List(fields.Nested(ScheduledEventsForUserDataSchema), required=True)

