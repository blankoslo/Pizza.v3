import sqlalchemy as sa
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db import db


class Image(db.Model):
    __tablename__ = "images"
    cloudinary_id = sa.Column(sa.String, primary_key=True)
    uploaded_by_id = sa.Column(sa.String, sa.ForeignKey('slack_users.slack_id'), nullable=False)
    uploaded_by = relationship("SlackUser", backref ="images", uselist=False)
    uploaded_at = sa.Column(sa.DateTime(timezone=True), server_default=func.now())
    title = sa.Column(sa.String)
    slack_organization_id = sa.Column(sa.String, sa.ForeignKey('slack_organizations.team_id'), nullable=False)

    def __eq__(self, other):
        if not isinstance(other, Image):
            return False
        return self.cloudinary_id == other.cloudinary_id and self.uploaded_by_id == other.uploaded_by_id \
               and self.uploaded_at == other.uploaded_at and self.title == other.title \
               and self.slack_organization_id == other.slack_organization_id

    def __repr__(self):
        return "<Image(id={self.cloudinary_id!r})>".format(self=self)
