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
  description = "As we have two different folders thats connected to the same pipeline we add the pipeline Id manualy"
  default = "ca5f3b56-618c-4e63-9284-39029d096782"
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

