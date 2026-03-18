# Testing Guide

## Running Backend Tests

### Quick Start

From the `application/containers/development` directory:

```bash
# Run all tests
./run-tests.sh

# Run with pytest options
./run-tests.sh -v                    # Verbose output
./run-tests.sh -k test_auth          # Run specific tests matching pattern
./run-tests.sh -v --tb=short         # Verbose with short traceback
./run-tests.sh -s                    # Show print output
```

### Prerequisites

Make sure the backend container is running:
```bash
docker-compose up -d backend
```

That's it! The container now includes all test dependencies and PostgreSQL tools.

### How It Works

- The tests use `pytest-postgresql` which creates temporary PostgreSQL instances
- Tests run as the `postgres` user (PostgreSQL cannot run as root)
- The `run-tests.sh` script handles switching to the postgres user automatically
- All test dependencies are pre-installed in the Docker image

### Manual Testing

If you prefer to run tests manually:

```bash
docker-compose exec backend su - postgres -c "cd /srv/backend && python3 -m pytest tests -v"
```

### CI/CD

GitHub Actions (`.github/workflows/backend.yml`) runs tests natively on Ubuntu without Docker:
- Sets up Python 3.14
- Installs dependencies directly
- Runs pytest

The approach is simpler in CI because it doesn't involve Docker containers.
