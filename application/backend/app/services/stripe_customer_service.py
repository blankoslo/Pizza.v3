from app.repositories.stripe_customer_repository import StripeCustomerRepository
from app.models.stripe_customer_schema import StripeCustomerSchema

class StripeCustomerService:
    def get_by_customer_id(self, customer_id):
        return StripeCustomerRepository.get_by_id(customer_id)
    
    def get_by_team_id(self, team_id):
        count, stripe_customers = StripeCustomerRepository.get(filters = {'slack_organization_id': team_id})
        return stripe_customers[0] if count > 0 else None
    
    def get_premium_status(self, team_id):
        stripe_customer = self.get_by_team_id(team_id)
        if stripe_customer is None:
            return False
        return stripe_customer.is_premium
    
    def add(self, data, team_id):
        stripe_customer = self.get_by_team_id(team_id)
        if stripe_customer is not None:
            return None
        data.customer_id = stripe_customer.customer_id
        data.slack_organization_id = team_id
        return StripeCustomerRepository.upsert(data)
    
    def update(self, data, team_id):
        stripe_customer = self.get_by_team_id(team_id)
        
        if stripe_customer is None or stripe_customer.slack_organization_id != team_id:
            return None
        
        updated_stripe_customer = StripeCustomerSchema().load(data=data, instance=stripe_customer, partial=True)
        return StripeCustomerRepository.upsert(updated_stripe_customer)
    
    def delete(self, customer_id):
        return StripeCustomerRepository.delete(customer_id)
    
    def delete_by_team_id(self, team_id):
        stripe_customer = self.get_by_team_id(team_id)

        if stripe_customer is None:
            return False
        
        return StripeCustomerRepository.delete(stripe_customer.customer_id)
