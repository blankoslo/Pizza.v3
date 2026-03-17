#!/bin/bash
# Simple script to run backend tests in Docker

cd "$(dirname "$0")"

# Pass all arguments to pytest
if [ $# -eq 0 ]; then
    # No arguments, run all tests
    docker-compose exec backend su - postgres -c "cd /srv/backend && python3 -m pytest tests"
else
    # With arguments
    docker-compose exec backend su - postgres bash -c 'cd /srv/backend && python3 -m pytest tests "$@"' -- "$@"
fi
