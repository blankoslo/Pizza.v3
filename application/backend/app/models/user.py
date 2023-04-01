import sqlalchemy as sa
from app.db import db


class User(db.Model):
    __tablename__ = "users"
    id = sa.Column(db.String, primary_key=True)
    email = sa.Column(db.String, nullable=False)
    name = sa.Column(db.String, nullable=False)
    picture = sa.Column(db.String, nullable=False)
    slack_organization_id = sa.Column(sa.String, sa.ForeignKey('slack_organizations.team_id'), nullable=False)

    def __repr__(self):
      return "<User(id={self.id!r})".format(self=self)
