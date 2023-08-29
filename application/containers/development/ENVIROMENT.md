# Enviroment variables

# Development

Envs for development are defined in the `.env` file in `application/containers/development` folder of the project. This file is not commited to the repository, so you have to create it manually. You can use the `.env.example` file as a template inside `application/containers/development`.

# Production

Envs for production are defined through terraform variables. You can find them documented in the `variables.tf` file inside the `infrastructure` and `infrastructure/system` folders. These are defined in the Terraform GUI in the browser when releasing a new version.
