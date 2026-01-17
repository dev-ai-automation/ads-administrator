---
description: How to run backend tests using Docker
---

# Running Backend Tests

This workflow covers how to run the backend test suite using the isolated Docker environment.

## Prerequisites

- Docker Desktop installed and running.

## Running Tests

### 1. Run all tests (Unit + Integration)

Run the standard test suite which includes unit tests and integration tests using an in-memory database configuration.

```bash
docker-compose -f docker-compose.test.yml up --build backend-test
```

### 2. Run tests with Coverage Report

To generate a coverage report to see what percentage of the code is tested:

```bash
docker-compose -f docker-compose.test.yml up --build backend-test-cov
```

The report will be available in `backend/coverage/html/index.html`.

### 3. Run Integration Tests with Real Database

To run tests against a real PostgreSQL container (useful for testing database-specific queries):

```bash
docker-compose -f docker-compose.test.yml up --build backend-test-integration
```

## Clean Up

To stop containers and remove volumes (clean state):

```bash
docker-compose -f docker-compose.test.yml down -v
```

## Troubleshooting

If tests fail with "Connection refused" to the database, ensure the `test-db` service is healthy before running integration tests. The configuration already includes a `depends_on` condition.
