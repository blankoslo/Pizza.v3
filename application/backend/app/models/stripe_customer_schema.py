from app.db import db
from app.models.stripe_customer import StripeCustomer

from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import EXCLUDE


class StripeCustomerSchema(SQLAlchemySchema):
    class Meta:
        model = StripeCustomer
        include_relationships = True
        sqla_session = db.session
        load_instance = True

    

    