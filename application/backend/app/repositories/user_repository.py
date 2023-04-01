from app.models.user import User
from app.models.mixins import CrudMixin


class UserRepository(User, CrudMixin):
    pass
