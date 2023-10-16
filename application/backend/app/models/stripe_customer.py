import sqlalchemy as sa
from app.db import db

class StripeCustomer(db.Model):
    __tablename__ = "stripe_customer"
    customer_id = sa.Column(sa.String, primary_key=True)
    team_id = sa.Column(sa.String, sa.ForeignKey('slack_organization.team_id'), nullable=False)
    created_at = sa.Column(sa.DateTime, nullable=False)
    is_premium = sa.Column(sa.Boolean, nullable=False)
    premium_from = sa.Column(sa.DateTime, nullable=True)
    premium_to = sa.Column(sa.DateTime, nullable=True)

    def __eq__(self, other):
        if not isinstance(other, StripeCustomer):
            return False
        return self.customer_id == other.customer_id \
            and self.team_id == other.team_id \
            and self.created_at == other.created_at \
            and self.is_premium == other.is_premium \
            and self.premium_from == other.premium_from \
            and self.premium_to == other.premium_to
    
