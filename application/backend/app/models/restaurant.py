import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.hybrid import hybrid_property, hybrid_method
from sqlalchemy.orm import relationship
from sqlalchemy import func, select
from app.db import db
from app.models.rating import Rating

from app.models.soft_delete import QueryWithSoftDelete


class Restaurant(db.Model):
    __tablename__ = "restaurants"
    id = sa.Column(UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()"))
    name = sa.Column(sa.String, nullable=False)
    link = sa.Column(sa.String, nullable=True)
    tlf = sa.Column(sa.String, nullable=True)
    address = sa.Column(sa.String, nullable=True)
    deleted = sa.Column(sa.Boolean, nullable=False, server_default='f')
    ratings = relationship("Rating", uselist=True, lazy="dynamic", cascade="all, delete-orphan")
    slack_organization_id = sa.Column(sa.String, sa.ForeignKey('slack_organizations.team_id'), nullable=False)

    @hybrid_property
    def rating(self):
        return self.ratings.with_entities(func.avg(Rating.rating)).scalar()

    @rating.expression
    def rating(cls):
        return (
            select(func.avg(Rating.rating))
            .where(Rating.restaurant_id == cls.id)
            .label("rating")
        )

    query_class = QueryWithSoftDelete

    def __eq__(self, other):
        if not isinstance(other, Restaurant):
            return False
        return self.id == other.id and self.name == other.name and self.link == other.link and self.tlf == other.tlf \
            and self.address == other.address and self.deleted == other.deleted \
            and self.slack_organization_id == other.slack_organization_id
  
    def __repr__(self):
        return "<Restaurant(id={self.id!r})>".format(self=self)
