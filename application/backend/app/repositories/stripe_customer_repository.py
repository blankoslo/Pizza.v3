from app.models.stripe_customer import StripeCustomer
from app.models.mixins import CrudMixin


class StripeCustomerRepository(StripeCustomer, CrudMixin):
    pass
