# Ads Administrator Platform

> **Enterprise-grade advertising campaign management platform** built with FastAPI and Next.js, featuring Auth0 authentication and Meta Ads integration.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

The **Ads Administrator Platform** is a full-stack application designed to streamline the management of advertising campaigns and client data. It provides secure, role-based access to Meta Ads metrics and administrative tools through a modern, responsive interface.

### Key Capabilities
- 🔐 **Secure Authentication** via Auth0 SSO
- 📊 **Real-time Metrics** from Meta Ads API
- 👥 **Client Management** with relationship tracking
- 🎨 **Modern UI** built with Next.js and TypeScript
- 🚀 **Cloud-Ready** deployment on Render

---

## ✨ Features

### Backend (FastAPI)
- RESTful API with automatic OpenAPI documentation (`/docs`)
- JWT-based authentication with Auth0
- PostgreSQL database with SQLAlchemy ORM
- Meta Ads integration for campaign metrics
- Comprehensive test suite with pytest

### Frontend (Next.js)
- Server-side rendering and static generation
- Type-safe API client with Zod validation
- Auth0 middleware for protected routes
- Responsive, component-based architecture
- Modern React 19 features

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|:------|:-----------|:--------|
| **Backend** | FastAPI | ≥0.115.0 |
| **Frontend** | Next.js | 16.1.3 |
| **Database** | PostgreSQL | - |
| **ORM** | SQLAlchemy | ≥2.0.0 |
| **Auth** | Auth0 | - |
| **Runtime** | Python | 3.10+ |
| **Runtime** | Node.js | 18.17.0 |

---

## 📁 Project Structure

```
ads-administrator/
├── backend/              # FastAPI application
│   ├── app/
│   │   ├── api/         # API routes (v1)
│   │   ├── core/        # Config, security, dependencies
│   │   ├── models/      # SQLAlchemy models
│   │   └── services/    # Business logic
│   ├── tests/           # Pytest test suite
│   └── requirements.txt
├── frontend/            # Next.js application
│   ├── src/
│   │   ├── app/        # App Router pages
│   │   ├── lib/        # Utilities, API client
│   │   └── types/      # TypeScript definitions
│   └── package.json
├── docs/                # Project documentation
│   ├── BUSINESS_PRESENTATION.md
│   ├── TECHNICAL_DEEP_DIVE.md
│   └── CREDENTIALS_AND_SERVICES.md
├── docker-compose.yml   # Local development
├── docker-compose.test.yml  # Testing environment
└── render.yaml          # Render deployment config
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18.17+**
- **PostgreSQL 14+**
- **Docker** (optional, for containerized development)

### Local Development

#### 1. Clone the Repository
```bash
git clone https://github.com/dev-ai-automation/ads-administrator.git
cd ads-administrator
```

#### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your Auth0 and database credentials

# Run migrations (if applicable)
# alembic upgrade head

# Start the server
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`  
API docs at `http://localhost:8000/docs`

#### 3. Frontend Setup
```bash
cd frontend
npm install

# Copy and configure environment variables
cp .env.example .env.local
# Edit .env.local with your Auth0 credentials

# Start the dev server
npm run dev
```

Frontend will be available at `http://localhost:10000`

#### 4. Using Docker (Alternative)
```bash
# Start all services
docker-compose up --build

# Run tests
docker-compose -f docker-compose.test.yml up --build backend-test
```

---

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs) directory:

- **[Business Presentation](./docs/BUSINESS_PRESENTATION.md)** - Value proposition and roadmap
- **[Technical Deep Dive](./docs/TECHNICAL_DEEP_DIVE.md)** - Architecture and deployment
- **[Credentials & Services](./docs/CREDENTIALS_AND_SERVICES.md)** - Environment setup guide
- **[Backend README](./backend/README.md)** - Backend-specific documentation
- **[Frontend README](./frontend/README.md)** - Frontend-specific documentation
- **[Development Guide](./docs/DEVELOPMENT.md)** - Contributing and coding standards

---

## 🌐 Deployment

This project is configured for deployment on **Render** using Infrastructure as Code.

### Automated Deployment
1. Connect your GitHub repository to Render
2. Render will automatically detect `render.yaml`
3. Configure environment variables via Render dashboard
4. Deploy!

See [TECHNICAL_DEEP_DIVE.md](./docs/TECHNICAL_DEEP_DIVE.md) for detailed deployment instructions.

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Follow [Conventional Commits](https://www.conventionalcommits.org/) format
4. Write tests for new features
5. Submit a pull request

### Commit Message Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`, `perf`, `ci`

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **API Documentation**: `/docs` endpoint when running
- **GitHub**: [dev-ai-automation/ads-administrator](https://github.com/dev-ai-automation/ads-administrator)

---

**Built with ❤️ by the Dev AI Automation Team**
