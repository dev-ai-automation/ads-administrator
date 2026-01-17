# Ads Administrator Platform - Technical Deep Dive

## Architecture Overview
The platform follows a modern **Client-Server** architecture, organized as a monorepo for easier dependency management and deployment auditing.

### Tech Stack
- **Frontend**: Next.js (React) - providing a fast, SEO-friendly, and interactive user interface.
- **Backend**: FastAPI (Python) - high-performance, easy-to-learn framework for building APIs with standard Python type hints.
- **Database**: PostgreSQL - robust relational database for persistent storage.
- **Authentication**: Auth0 - managed authentication service.
- **Deployment**: Render - unified cloud platform for hosting web services and databases.

## Project Structure
```text
ads-administrator/
├── backend/            # FastAPI application
│   ├── app/            # Application logic (models, schemas, api)
│   └── tests/          # Pytest suite
├── frontend/           # Next.js application
│   ├── src/            # Source code (components, pages, utils)
│   └── public/         # Static assets
├── docs/               # Project documentation
├── docker-compose.yml  # Local development orchestration
└── render.yaml         # Render Infrastructure as Code (IaC) configuration
```

## Deployment Strategy
The project is configured for **Continuous Deployment** via Render.

1.  **Repository Connection**: Render connects to the GitHub repository.
2.  **Infrastructure as Code**: The `render.yaml` file defines the services:
    - `ads-backend`: Python service running Uvicorn.
    - `ads-frontend`: Node.js service running Next.js.
    - `ads-db`: Managed PostgreSQL database.
3.  **Build Process**:
    - Backend: `pip install -r requirements.txt`
    - Frontend: `npm install && npm run build`

## Key Technical Decisions
- **Monorepo**: Keeps frontend and backend synchronized in version control.
- **FastAPI**: Chosen for speed and automatic Swagger UI documentation generation (`/docs`).
- **Next.js**: Chosen for its robust routing and server-side rendering capabilities.
- **Type Safety**: Pydantic models in backend and TypeScript in frontend ensuring data consistency.
