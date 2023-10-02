variable "prefix" {
  description = "High-level name of this configuration, used as a resource name prefix"
  type = string
  default = "pizzabot-v3"
}

variable "heroku_api_key" {
  type = string
}

variable "heroku_api_email" {
  type = string
}

variable "heroku_team_id" {
  type = string
}

variable "heroku_team_name" {
  type = string
}

# ************* PRODUCTION ************* #

variable "PRODUCTION_SLACK_APP_TOKEN" {
  type = string
}

variable "PRODUCTION_SLACK_CLIENT_ID" {
  type = string
}

variable "PRODUCTION_SLACK_CLIENT_SECRET" {
  type = string
}

variable "PRODUCTION_SLACK_SIGNING_SECRET" {
  type = string
}

variable "PRODUCTION_SECRET_KEY_BACKEND" {
  type = string
}

variable "PRODUCTION_CLOUDINARY_CLOUD_NAME" {
  type = string
}

variable "PRODUCTION_CLOUDINARY_API_KEY" {
  type = string
}

variable "PRODUCTION_CLOUDINARY_API_SECRET" {
  type = string
}

variable "EXISTING_PIPELINE_ID" {
  type = string
  description = "As we have two different folders thats connected to the same pipeline we remotely create the pipeline and add the pipeline Id manualy"
  default = "04d41f30-3c8e-41a4-bde4-577db41b97a0"
}


# ************* STAGING ************* #

# variable "STAGING_SLACK_APP_TOKEN" {
#   type = string
# }

# variable "STAGING_SLACK_CLIENT_ID" {
#   type = string
# }

# variable "STAGING_SLACK_CLIENT_SECRET" {
#   type = string
# }

# variable "STAGING_SLACK_SIGNING_SECRET" {
#   type = string
# }

# variable "STAGING_SECRET_KEY_BACKEND" {
#   type = string
# }

# variable "STAGING_CLOUDINARY_CLOUD_NAME" {
#   type = string
# }

# variable "STAGING_CLOUDINARY_API_KEY" {
#   type = string
# }

# variable "STAGING_CLOUDINARY_API_SECRET" {
#   type = string
# }

