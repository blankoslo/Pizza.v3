# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

PizzaBot v3 is a Slack bot application for organizing pizza events. The system consists of three main applications (backend, bot worker, and Next.js frontend) that communicate via RabbitMQ message broker and share a PostgreSQL database.

## Architecture

### Core Components

1. **Backend** (`application/backend/`): Flask REST API
   - Handles HTTP requests from the frontend
   - Manages database operations via SQLAlchemy
   - Publishes events to RabbitMQ and handles RPC requests from the bot
   - Implements OAuth2-based Slack authentication with JWT

2. **Bot Worker** (`application/bot/`): Slack Socket Mode bot
   - Consumes messages from RabbitMQ event queue
   - Interacts with Slack API (messages, events, slash commands)
   - Runs as a background worker process

3. **Next.js Frontend** (`application/next-frontend/`): Admin interface
   - Pages Router architecture (not App Router)
   - Uses SWR for data fetching
   - Tailwind CSS + Material UI for styling
   - OAuth flow with Slack for authentication

4. **Legacy Frontend** (`application/frontend/`): React app from v2
   - Reference only, not actively developed

### Message Broker Communication

- **RabbitMQ** mediates between backend and bot
- Backend publishes events (pizza invitations, reminders) that bot consumes
- Bot makes RPC calls to backend for data queries
- Exchange: `Pizza_Exchange`, Queue: `Pizza_Queue`
- Message structure defined in `app/services/broker/schemas/message.py` (backend) and `src/broker/schemas/` (bot)

### Database

- PostgreSQL shared by both backend and bot
- Models defined in `application/backend/app/models/`
- Migrations managed via Flask-Migrate
- Key entities: Event, Invitation, Restaurant, SlackOrganization, User, Group

### Authentication & Security

- Frontend uses Slack OAuth for login
- Backend issues JWT tokens stored as HttpOnly cookies
- Flask-Talisman enforces security headers
- HTTPS required (self-signed certs for local dev)

## Development Setup

### Prerequisites

Generate SSL certificates for local nginx:
```bash
cd application/containers/development
openssl req -x509 -nodes -newkey rsa:4096 -keyout nginx-selfsigned.key -out nginx-selfsigned.crt -sha256 -days 365
```

Create `.env` file in `application/containers/development/` based on `.env.example`. Must include Slack credentials (see README.md "Slack App Bot setup" section).

### Running Locally

Start all services with docker-compose:
```bash
cd application/containers/development
docker-compose up
```

Or run specific services:
```bash
docker-compose up backend bot-worker next-frontend
```

Services run behind nginx on:
- Port 443 (HTTPS): Main entry point
- Port 4434: Alternative HTTPS port
- Port 4000: Direct next-frontend access

### Backend Development

Run tests from `application/backend/`:
```bash
python3 -m pytest tests
```

Run specific tests:
```bash
python3 -m pytest tests -k test_name
```

Show output during tests:
```bash
python3 -m pytest tests -s -v
```

Run database migrations:
```bash
cd application/backend
export FLASK_APP=main.py
flask db upgrade
```

Generate new migration:
```bash
flask db migrate -m "migration description"
```

### Frontend Development

From `application/next-frontend/`:

```bash
npm run dev          # Start dev server on port 4000
npm run build        # Build for production
npm run lint         # Lint with max warnings 0
npm run fix          # Auto-fix lint issues
npm run typecheck    # Type check without emitting
```

### Bot Development

The bot worker runs automatically in docker-compose. Bot tests are TODO.

## Key Patterns

### Backend: Blueprint Registration

Blueprints are registered in `application.py`:
- Each API module (events, restaurants, users, invitations, images, auth, slack, groups) has a blueprint in `app/api/`
- All registered under `/api` prefix
- CRUD operations in `app/api/crud/`

### Backend: Service Layer

Services in `app/services/` handle business logic:
- `EventService`: Pizza event management
- `InvitationService`: Invitation lifecycle (create, remind, RSVP)
- `RestaurantService`: Restaurant data management
- `SlackOrganizationService`: Slack workspace management
- `BrokerService`: RabbitMQ message publishing and RPC responses

Services are dependency-injected via `app/services/injector.py`.

### Backend: Broker Handlers

RPC message handlers in `app/services/broker/handlers/`:
- `MessageHandler` routes by message type
- Each handler processes specific request types from bot
- Schemas in `app/services/broker/schemas/` define request/response structure

### Bot: Event Handlers

Slack event handlers in `src/slack/__init__.py`:
- `@slack_app.event()` decorators for Slack events
- `@slack_app.command()` for slash commands
- `handle_file_share`, `handle_message`, `handle_member_joined`, etc.

### Bot: Broker Consumer

Bot broker handlers in `src/broker/handlers/`:
- `broker_client.py` consumes from RabbitMQ queue
- Routes messages by type to specific handlers
- Sends Slack messages based on events

### Frontend: API Integration

API client in `src/api/`:
- HTTP client configured with credentials
- SWR hooks for data fetching with revalidation
- React Hook Form + Zod for form validation

### Frontend: Pages Structure

- Landing page: `pages/index.tsx`
- Admin panel: `pages/admin/`
- Login flow: `pages/login/`
- Slack OAuth callback: `pages/slack/`

## Important Notes

- **Locale issues**: Alpine containers don't handle locales properly; time strings in messages may be incorrectly localized
- **Cloudinary**: File shares upload images to Cloudinary; update `upload_preset` in `bot/src/slack/__init__.py` for your account
- **HTTPS required**: OAuth2 flow requires HTTPS even in development
- **Deployment**: Uses Terraform + Heroku (see README.md); separate staging/prod environments
- **Branches**: `main` for staging, `prod` for production
- **Python runtime**: Check `runtime.txt` files for required Python version
- **Node version**: Requires Node.js >=20.x

## Terraform Deployment

### Infrastructure Structure

The infrastructure is organized into **two separate workspaces**:
- `infrastructure/prod/` - Production environment
- `infrastructure/staging/` - Staging environment

Each environment uses a reusable **system module** (`system/main.tf`) that defines all Heroku resources.

**Important**: The configuration is split across directories - `infrastructure/prod/` manages production, while `infrastructure/staging/` manages staging. Each is a separate Terraform Cloud workspace.

### Heroku Architecture

For each environment, Terraform creates **three Heroku apps**:

```
{prefix}-{environment}-backend     # Flask API (web dyno)
{prefix}-{environment}-bot         # Slack bot worker (worker dyno)
{prefix}-{environment}-frontend    # Next.js app (web dyno)
```

Example for production:
- `pizzabot-v3-prod-backend`
- `pizzabot-v3-prod-bot`
- `pizzabot-v3-prod-frontend`

### Deployment Source

Applications are deployed via `heroku_build` resources that reference **local paths**:

```hcl
heroku_build.backend   → application/backend/
heroku_build.bot       → application/bot/
heroku_build.frontend  → application/next-frontend/
```

**Buildpacks**:
- Backend: `heroku-buildpack-locale` + `heroku-buildpack-python`
- Bot: `heroku-buildpack-locale` + `heroku-buildpack-python`
- Frontend: Auto-detected Next.js buildpack

### Shared Infrastructure

Three add-ons are provisioned on the **backend app** and **attached** to the bot app:

1. **PostgreSQL** (`heroku_addon.database`)
   - Production: `heroku-postgresql:standard-0`
   - Staging: `heroku-postgresql:mini`
   - Shared between backend and bot via `heroku_addon_attachment`

2. **CloudAMQP** (RabbitMQ) (`heroku_addon.cloudamqp-backend`)
   - Production: `cloudamqp:tiger`
   - Staging: `cloudamqp:lemur`
   - Provides `CLOUDAMQP_URL` environment variable

3. **Papertrail** (Logging) (`heroku_addon.papertrail-backend`)
   - Both environments: `papertrail:choklad`
   - Centralized logging for backend and bot

### Custom Domains

Two custom domains per environment:

**Production**:
- Frontend: `www.pizzabot.app`
- Backend: `api.www.pizzabot.app`

**Staging**:
- Frontend: `staging.pizzabot.app`
- Backend: `api.staging.pizzabot.app`

DNS CNAME records must point to Heroku's DNS targets (found in app settings).

### Scaling Configuration

Dyno formation is configured per app:

```hcl
FORMATION_SIZE_BACKEND = "Basic"         # Dyno size
FORMATION_QUANTITY_BACKEND = 1           # Number of dynos
```

Production uses `Basic` dynos, staging can use smaller sizes to reduce costs.

### Environment Variables

Configuration is passed via module variables:

**Slack credentials** (separate per environment):
- `SLACK_APP_TOKEN`, `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, `SLACK_SIGNING_SECRET`

**Cloudinary credentials**:
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

**RabbitMQ settings**:
- `MQ_EXCHANGE`: "Pizza_Exchange"
- `MQ_EVENT_QUEUE`: "Pizza_Queue"
- `MQ_RPC_KEY`: "rpc"
- `MQ_EVENT_KEY`: "pizza"

**Business logic**:
- `DAYS_IN_ADVANCE_TO_INVITE`: 10
- `HOURS_BETWEEN_REMINDERS`: 4
- `REPLY_DEADLINE_IN_HOURS`: 24

**URIs** (environment-specific):
- `FRONTEND_URI`, `BACKEND_URI`, `NEXT_PUBLIC_BACKEND_URI`

### Pipeline Management

All apps are coupled to an existing Heroku pipeline:

```hcl
EXISTING_PIPELINE_ID = "ca5f3b56-618c-4e63-9284-39029d096782"
```

Apps are assigned to appropriate stages:
- Production apps → "production" stage
- Staging apps → "staging" stage

### Applying Terraform Changes

**Local deployment** (if not using Terraform Cloud):
```bash
cd infrastructure/prod     # or staging
terraform init
terraform plan
terraform apply
```

**Terraform Cloud** (recommended):
- Separate workspaces for prod and staging
- Connected to `prod` branch for production, `main` branch for staging
- Manual plan and apply workflow
- Secrets stored in Terraform Cloud workspace variables

**Note**: Terraform Cloud requires manual branch selection update - it doesn't automatically listen for branch changes.

### Database Migrations

Database migrations run automatically on backend deployment via `Procfile`:

```
web: (export FLASK_APP=main.py && flask db upgrade) && gunicorn main:app --log-file -
```

The backend runs `flask db upgrade` before starting the Gunicorn server.

### Deployment Workflow

1. Make code changes on a feature branch
2. Merge to `main` (triggers staging deploy via Terraform Cloud)
3. Test on staging environment
4. Merge `main` to `prod` branch
5. Terraform Cloud plans changes for production
6. Manually apply plan in Terraform Cloud
7. Heroku receives updated builds and deploys

**Note**: Promoting apps from staging to prod via Heroku pipelines has not been tested - deployments are done independently via Terraform.

## Code Quality

- Backend: pytest for testing
- Frontend: ESLint + Prettier (enforced via pre-commit hooks)
- Frontend: TypeScript strict mode enabled
- Backend: Type hints not consistently used (Python 3.x)

## Common Workflows

### Adding a new API endpoint

1. Define schema in `app/models/` if new entity
2. Create repository methods in `app/repositories/`
3. Add service methods in `app/services/`
4. Create blueprint methods in `app/api/`
5. Write tests in `tests/api/` and `tests/services/`

### Adding a new bot event handler

1. Define handler in `src/slack/__init__.py` with decorator
2. Add message broker schema if backend communication needed
3. Add broker handler in `src/broker/handlers/` if consuming events
4. Update bot permissions in Slack app config if needed

### Adding a new frontend page

1. Create page component in `pages/`
2. Add API client methods in `src/api/`
3. Use SWR hooks for data fetching
4. Follow existing patterns for layouts and components

## Slack Integration

See README.md diagrams:
- `README/InstallFlow.png`: Bot installation to workspace
- `README/LoginFlow.png`: User authentication with Slack

Slack permissions scopes defined in `app/api/slack.py` GET `/install` endpoint.
