resource "heroku_pipeline" "pizzabot" {
  name = var.prefix

  owner {
    id = var.heroku_team_id
    type = "team"
  }
}


module "production" {
  source = "./system"

  heroku_team_name = var.heroku_team_name
  hostname = "www.pizzabot.app"
  prefix = var.prefix
  environment = "prod"
  CLOUDAMQP_PLAN = "cloudamqp:tiger"
  PAPERTRAIL_PLAN = "papertrail:choklad"
  POSTGRES_PLAN = "heroku-postgresql:standard-0"
  FORMATION_SIZE_FRONTEND = "Basic"
  FORMATION_SIZE_BACKEND = "Basic"
  FORMATION_SIZE_BOT_WORKER = "Basic"
  FORMATION_QUANTITY_FRONTEND = 1
  FORMATION_QUANTITY_BACKEND = 1
  FORMATION_QUANTITY_BOT_WORKER = 1
  SLACK_APP_TOKEN = var.PRODUCTION_SLACK_APP_TOKEN
  SLACK_CLIENT_ID = var.PRODUCTION_SLACK_CLIENT_ID
  SLACK_CLIENT_SECRET = var.PRODUCTION_SLACK_CLIENT_SECRET
  SLACK_SIGNING_SECRET = var.PRODUCTION_SLACK_SIGNING_SECRET
  SECRET_KEY_BACKEND = var.PRODUCTION_SECRET_KEY_BACKEND
  CLOUDINARY_CLOUD_NAME  = var.PRODUCTION_CLOUDINARY_CLOUD_NAME
  CLOUDINARY_API_KEY  = var.PRODUCTION_CLOUDINARY_API_KEY
  CLOUDINARY_API_SECRET  = var.PRODUCTION_CLOUDINARY_API_SECRET
  MQ_EVENT_KEY = "pizza"
  MQ_EVENT_QUEUE = "Pizza_Queue"
  MQ_EXCHANGE = "Pizza_Exchange"
  MQ_RPC_KEY = "rpc"
  DAYS_IN_ADVANCE_TO_INVITE = 10
  HOURS_BETWEEN_REMINDERS = 4
  REPLY_DEADLINE_IN_HOURS = 24
  FLASK_ENV = "production"
  BACKEND_URI = "api.www.pizzabot.app"
  NEXT_PUBLIC_BACKEND_URI = "https://api.www.pizzabot.app"
  FRONTEND_URI = "www.pizzabot.app"
}

# Add production apps to pipeline under production stage
resource "heroku_pipeline_coupling" "production-backend" {
  app_id = module.production.app_backend_id
  pipeline = heroku_pipeline.pizzabot.id
  stage = "production"
}

# Add production apps to pipeline under production stage
resource "heroku_pipeline_coupling" "production-bot" {
  app_id = module.production.app_bot_id
  pipeline = heroku_pipeline.pizzabot.id
  stage = "production"
}

# Add production apps to pipeline under production stage
resource "heroku_pipeline_coupling" "production-frontend" {
  app_id = module.production.app_frontend_id
  pipeline = heroku_pipeline.pizzabot.id
  stage = "production"
}


# module "staging" {
#   source = "./system"

#   heroku_team_name = var.heroku_team_name
#   hostname = "staging.pizzabot.app"
#   prefix = var.prefix
#   environment = "stag"
#   CLOUDAMQP_PLAN = "cloudamqp:lemur"
#   PAPERTRAIL_PLAN = "papertrail:choklad"
#   POSTGRES_PLAN = "heroku-postgresql:mini"
#   FORMATION_SIZE_FRONTEND = "Basic"
#   FORMATION_SIZE_BACKEND = "Basic"
#   FORMATION_SIZE_BOT_WORKER = "Basic"
#   FORMATION_QUANTITY_FRONTEND = 1
#   FORMATION_QUANTITY_BACKEND = 1
#   FORMATION_QUANTITY_BOT_WORKER = 1
#   SLACK_APP_TOKEN = var.STAGING_SLACK_APP_TOKEN
#   SLACK_CLIENT_ID: var.STAGING_SLACK_CLIENT_ID
#   SLACK_CLIENT_SECRET: var.STAGING_SLACK_CLIENT_SECRET
#   SLACK_SIGNING_SECRET: var.STAGING_SLACK_SIGNING_SECRET
#   SECRET_KEY_BACKEND = var.STAGING_SECRET_KEY_BACKEND
#   CLOUDINARY_CLOUD_NAME  = var.STAGING_CLOUDINARY_CLOUD_NAME
#   CLOUDINARY_API_KEY  = var.STAGING_CLOUDINARY_API_KEY
#   CLOUDINARY_API_SECRET  = var.STAGING_CLOUDINARY_API_SECRET
#   MQ_EVENT_KEY = "pizza"
#   MQ_EVENT_QUEUE = "Pizza_Queue"
#   MQ_EXCHANGE = "Pizza_Exchange"
#   MQ_RPC_KEY = "rpc"
#   DAYS_IN_ADVANCE_TO_INVITE = 10
#   HOURS_BETWEEN_REMINDERS = 4
#   REPLY_DEADLINE_IN_HOURS = 24
#   FLASK_ENV = "production"
#   BACKEND_URI = "api.staging.pizzabot.app"
#   NEXT_PUBLIC_BACKEND_URI = "https://api.staging.pizzabot.app"
#   FRONTEND_URI = "staging.pizzabot.app"
# }

# #Add staging apps to pipeline under staging stage
# resource "heroku_pipeline_coupling" "staging-backend" {
#   app_id = module.staging.app_backend_id
#   pipeline = heroku_pipeline.pizzabot.id
#   stage = "staging"
# }

# resource "heroku_pipeline_coupling" "staging-bot" {
#   app_id = module.staging.app_bot_id
#   pipeline = heroku_pipeline.pizzabot.id
#   stage = "staging"
# }

# resource "heroku_pipeline_coupling" "staging-frontend" {
#   app_id = module.staging.app_frontend_id
#   pipeline = heroku_pipeline.pizzabot.id
#   stage = "staging"
# }

