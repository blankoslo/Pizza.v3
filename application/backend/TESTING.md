# Backend Testing Improvements

## Current State

The backend has **23 test files** (~1,837 lines) covering API endpoints, services, and broker handlers. Tests use a real PostgreSQL database (via `pytest_postgresql`), auto-mocked RabbitMQ broker, and multi-tenant fixtures with 2 Slack organizations.

### What's covered

| Layer           | Files        | Coverage                                                                   |
| --------------- | ------------ | -------------------------------------------------------------------------- |
| API endpoints   | 8 test files | Good — events, restaurants, groups, invitations, slack users, images, auth |
| Services        | 8 test files | Good — all services have tests                                             |
| Broker handlers | 5 test files | Moderate — action, get, update handlers covered well                       |

### What's missing or thin

| Area                       | Status             | Notes                                                                    |
| -------------------------- | ------------------ | ------------------------------------------------------------------------ |
| **Repositories**           | No dedicated tests | Only covered indirectly through service tests                            |
| **test_slack.py**          | 49 lines           | Minimal coverage of Slack API endpoints                                  |
| **test_broker_service.py** | 28 lines           | Only 2 basic tests (respond, publish)                                    |
| **test_create_handler.py** | 31 lines           | Only 1 test (create_image)                                               |
| **Pagination**             | Not tested         | Services accept pagination params but response structure isn't validated |
| **Error/validation paths** | Sparse             | Most tests cover happy paths; few test invalid input or error responses  |
| **Model validation**       | None               | No tests for schema serialization/deserialization or model constraints   |
| **Soft delete behavior**   | None               | Models use soft delete mixin but it's not explicitly tested              |

---

### 1. Add a pytest configuration file

There's no `pytest.ini`, `pyproject.toml`, or `setup.cfg` for pytest. Add one to standardize test runs:

```ini
# pyproject.toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = "test_*.py"
python_classes = "Test*"
python_functions = "test_*"
markers = [
    "slow: marks tests that require external services",
    "integration: marks integration tests",
]
```

### 2. Test pagination responses

The current branch (`bugfix-pagination-not-handled`) is fixing pagination in CRUD endpoints and services. Tests should validate:

- Default pagination values when no params are provided
- Custom page/per_page parameters
- Response structure includes pagination metadata (total, pages, current page)
- Edge cases: page beyond range, per_page=0, negative values

Example test:

```python
def test_get_events_pagination(self, app, db, events, users):
    token = create_access_token(identity=users["testSlackOrganizationId1"])
    headers = {"Authorization": f"Bearer {token}"}

    response = self.client.get(
        url_for("events.get_events", page=1, per_page=1),
        headers=headers
    )
    assert response.status_code == 200
    data = response.get_json()
    assert len(data["items"]) == 1
    assert data["total"] >= 2
    assert data["page"] == 1
```

### 3. Test error responses and validation

Most tests only cover happy paths. Add tests for:

- **400 Bad Request**: Missing required fields, invalid data types
- **404 Not Found**: Non-existent resource IDs
- **403 Forbidden**: Accessing another organization's resources (some exist, expand)
- **401 Unauthorized**: Missing or expired tokens
- **422 Unprocessable Entity**: Valid JSON but failing business rules

### 4. Add repository layer tests

The 8 repository files (`app/repositories/`) have zero dedicated tests. While they're indirectly tested through services, direct tests would catch issues faster and be easier to debug.

Priority repositories to test:

- `EventRepository` — complex queries (events needing invitations, scheduled events)
- `InvitationRepository` — filtering by multiple criteria, status transitions
- `SlackUserRepository` — user ID selection logic for invitations

### 5. Expand broker handler tests

- **`test_create_handler.py`**: Only tests `create_image`. Add tests for other create operations.
- **`test_broker_service.py`**: Only 2 tests. Add tests for message serialization, error handling, queue publishing failures.
- **Queue error handling**: Test malformed messages, connection failures, retry behavior.

### 6. Expand Slack endpoint tests

`test_slack.py` has only 49 lines. Key gaps:

- OAuth install flow
- Workspace installation/deinstallation
- Event subscription verification
- Error handling for Slack API failures

### 7. Add model/schema tests

No tests validate model schemas. Add tests for:

- Schema serialization (model -> JSON) produces expected fields
- Schema deserialization (JSON -> model) validates required fields
- Nested relationships serialize correctly (e.g., Event with Restaurant, Invitations)
- Soft delete mixin behavior (deleted records excluded from queries, restore works)

### 8. Add test factories or a fixture builder

The current `conftest.py` (312 lines) creates a fixed set of test data. This makes it hard to test edge cases that need specific data setups. Consider:

- **Factory pattern** using `factory_boy` or simple builder functions
- Makes it easy to create one-off test data without modifying shared fixtures
- Reduces coupling between tests

Example:

```python
# tests/factories.py
def make_event(db, organization, restaurant=None, **overrides):
    defaults = {
        "slack_organization_id": organization.id,
        "time": datetime(2025, 6, 15, 18, 0),
        "person_quota": 10,
        "finalized": False,
    }
    defaults.update(overrides)
    if restaurant:
        defaults["restaurant_id"] = restaurant.id
    event = Event(**defaults)
    db.session.add(event)
    db.session.commit()
    return event
```

### 9. Add CI integration

If not already running, add test execution to CI/CD:

- Run tests on every PR
- Fail the build if tests fail or coverage drops below threshold
- Consider a GitHub Actions workflow or pre-commit hook

---

## Suggested Priority Order

1. **Add pytest config** — standardize test runs
2. **Test pagination** — directly relevant to current branch work
3. **Test error responses** — biggest gap in existing tests
4. **Repository tests** — untested layer
5. **Expand thin test files** — slack, broker service, create handler
6. **Model/schema tests** — catch serialization bugs
7. **Test factories** — improve test maintainability
8. **CI integration** — prevent regressions

## Running Tests

```bash
cd application/backend

# All tests
python3 -m pytest tests

# With verbose output
python3 -m pytest tests -s -v

# Specific test file
python3 -m pytest tests/api/test_events.py

# Specific test by name
python3 -m pytest tests -k test_get_events

# With coverage (after adding pytest-cov)
python3 -m pytest tests --cov=app --cov-report=term-missing
```
