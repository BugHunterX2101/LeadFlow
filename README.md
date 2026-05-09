# LeadFlow - CRM Lead Management Application

A modern, full-stack CRM application for managing sales leads with real-time discussions, follow-ups, and status tracking. Built with React, Node.js, Express, Prisma, and PostgreSQL.

## Features

- **Lead Management**: Create, read, update, and filter sales leads
- **Status Tracking**: Track leads through pipeline stages (New to Won/Lost)
- **Discussion Timeline**: Log discussions and follow-ups per lead
- **Smart Follow-up Reminders**: See today's follow-up leads at a glance
- **Search & Filter**: Find leads by name or status in real-time
- **Secure API**: Input validation, CORS protection, error handling
- **Docker Support**: Complete containerization with PostgreSQL

## Architecture

```mermaid
graph TB
    subgraph Client["Frontend (React 18 + Vite)"]
        UI["UI Components<br/>- Lead List<br/>- Modals<br/>- Filter Bar"]
        Hooks["React Hooks<br/>- useLeads<br/>- useLeadDetail"]
        API["API Client<br/>leadflow.js"]
    end

    subgraph Server["Backend (Express + Prisma)"]
        Routes["API Routes<br/>/api/leads<br/>/api/leads/:id<br/>/api/discussions"]
        Controllers["Controllers<br/>- leads.controller<br/>- discussions.controller"]
        Services["Services<br/>- leads.service<br/>- discussions.service"]
        Middleware["Middleware<br/>- Validation<br/>- Error Handler<br/>- CORS"]
    end

    subgraph Database["Database (PostgreSQL 16)"]
        Leads["Leads Table<br/>id, name, company<br/>status, followUpAt"]
        Discussions["Discussions Table<br/>id, leadId, note<br/>followUpAt"]
    end

    UI -->|HTTP| API
    API -->|Fetch| Routes
    Routes --> Controllers
    Controllers --> Services
    Services --> Middleware
    Services -->|Prisma ORM| Leads
    Services -->|Prisma ORM| Discussions
    Middleware -->|Security| Routes

    style Client fill:#61dafb,stroke:#333,color:#000
    style Server fill:#68a063,stroke:#333,color:#fff
    style Database fill:#336791,stroke:#333,color:#fff
```

## Project Structure

```
LeadFlow/
├── backend/                          # Node.js Express API
│   ├── src/
│   │   ├── app.js                   # Express app setup with CORS, routes
│   │   ├── index.js                 # Server entry point, graceful shutdown
│   │   ├── controllers/
│   │   │   ├── leads.controller.js  # Lead request handlers
│   │   │   └── discussions.controller.js  # Discussion handlers
│   │   ├── services/
│   │   │   ├── leads.service.js     # Lead business logic
│   │   │   └── discussions.service.js   # Discussion logic
│   │   ├── routes/
│   │   │   ├── leads.js             # /api/leads routes
│   │   │   └── discussions.js       # /api/leads/:id/discussions routes
│   │   ├── middleware/
│   │   │   ├── validation.js        # Input validation (XSS prevention)
│   │   │   └── errorHandler.js      # Centralized error handling
│   │   └── lib/
│   │       ├── prisma.js            # Prisma client singleton
│   │       ├── errors.js            # Custom error classes
│   │       └── env.js               # Environment validation
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema with indexes
│   │   └── seed.js                  # Seed script (5 sample leads)
│   ├── test/
│   │   └── leadflow.test.js         # 5 integration tests
│   ├── Dockerfile                   # Alpine-based image with Prisma
│   └── package.json
│
├── frontend/                        # React + Vite SPA
│   ├── src/
│   │   ├── App.jsx                 # Root component
│   │   ├── main.jsx                # React entry with ErrorBoundary
│   │   ├── style.css               # Global styles
│   │   ├── api/
│   │   │   └── leadflow.js         # Typed API client
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Header.jsx      # Logo & Add Lead button
│   │   │   ├── leads/
│   │   │   │   ├── LeadList.jsx    # Filterable lead list
│   │   │   │   ├── LeadCard.jsx    # Individual lead row
│   │   │   │   ├── FilterBar.jsx   # Status filter pills
│   │   │   │   ├── SearchBar.jsx   # Name search input
│   │   │   │   └── FollowUpSection.jsx  # Today's reminders
│   │   │   ├── modals/
│   │   │   │   ├── AddLeadModal.jsx    # Create lead form
│   │   │   │   └── LeadTimelineModal.jsx  # Detail & discussions
│   │   │   ├── ui/
│   │   │   │   ├── Modal.jsx       # Accessible modal wrapper
│   │   │   │   ├── StatusBadge.jsx
│   │   │   │   ├── FollowUpBadge.jsx
│   │   │   │   └── HighlightText.jsx
│   │   │   └── ErrorBoundary.jsx   # Error catching component
│   │   ├── hooks/
│   │   │   ├── useLeads.js         # Fetch & filter leads
│   │   │   └── useLeadDetail.js    # Single lead with discussions
│   │   ├── types/
│   │   │   └── index.js            # Status enums & metadata
│   │   ├── utils/
│   │   │   ├── date.js             # Relative time formatting
│   │   │   ├── filters.js          # Lead filtering logic (+ tests)
│   │   │   └── status.js           # Status colors & labels
│   │   └── test/
│   │       ├── App.test.jsx        # Smoke test with mocked API
│   │       └── utils/filters.test.js  # 3 unit tests
│   ├── Dockerfile                  # Node:20-alpine
│   ├── vite.config.js              # React plugin, dev server on 5173
│   └── package.json
│
├── docker-compose.yml              # 3 services: postgres, backend, frontend
├── .gitignore                       # Exclude node_modules, dist, etc
├── .env.example                     # Template for env variables
├── package.json                     # Root workspace config
└── README.md                        # This file
```

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Git

### Using Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/LeadFlow.git
cd LeadFlow

# Build and start all services
docker compose up --build

# Open http://localhost:5173 in your browser
```

Database will be initialized automatically with 5 sample leads.

### Local Development

```bash
# 1. Install dependencies
npm install
npm install --prefix backend
npm install --prefix frontend

# 2. Setup environment
cp .env.example .env

# 3. Start PostgreSQL (or update DATABASE_URL to existing instance)
docker run --name leadflow-postgres -e POSTGRES_PASSWORD=leadflow \
  -e POSTGRES_DB=leadflow -p 5432:5432 -d postgres:16

# 4. Push schema and seed data
npm run seed --prefix backend

# 5. Start servers in separate terminals
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend  
npm run dev:frontend
```

## API Endpoints

### Leads
- `GET /api/leads` - List all leads
- `GET /api/leads/:id` - Get lead with discussions
- `POST /api/leads` - Create new lead
- `PATCH /api/leads/:id` - Update lead status/follow-up

### Discussions
- `POST /api/leads/:id/discussions` - Add note to lead

### Health
- `GET /health` - API health check

## Security Features

- **CORS Protection** - Restricted to known origins (localhost:5173, localhost:3000)
- **Input Validation** - Sanitizes all user inputs and prevents XSS
- **Error Boundary** - React error boundary catches component crashes
- **Graceful Shutdown** - Properly closes DB connections on SIGTERM/SIGINT
- **Database Indexes** - Optimized queries on status, dates, and lead IDs
- **Environment Variables** - Validates required env vars at startup

## Database Schema

### Leads
```sql
id          CUID (primary key)
name        String (required)
company     String (nullable)
phone       String (nullable)
status      String (default: "New")
followUpAt  DateTime (nullable)
createdAt   DateTime (default: now)
updatedAt   DateTime (auto-updated)
```

**Indexes**: status, createdAt, updatedAt, followUpAt

### Discussions
```sql
id          CUID (primary key)
leadId      String (foreign key to leads.id)
note        String (required)
followUpAt  DateTime (nullable)
createdAt   DateTime (default: now)
lead        Lead (cascade delete)
```

**Indexes**: leadId, createdAt

## Testing

```bash
# Backend integration tests (5 tests)
npm test

# Frontend unit tests (4 tests)  
npm test --prefix frontend
```

## Technologies

| Component | Tech Stack |
|-----------|-----------|
| **Frontend** | React 18, Vite 7, TypeScript types |
| **Backend** | Express 5, Node.js 20 |
| **Database** | PostgreSQL 16, Prisma 5.22 |
| **Testing** | Vitest, Supertest, React Testing Library |
| **Deployment** | Docker, Docker Compose |
| **Security** | CORS, Input validation, XSS prevention |

## Environment Variables

```bash
# Backend
DATABASE_URL=postgresql://leadflow:leadflow@localhost:5432/leadflow
PORT=3001
NODE_ENV=development

# Frontend
VITE_API_BASE_URL=http://localhost:3001
```

## Lead Statuses

- **New** (Green) - Newly added lead
- **Contacted** (Orange) - Initial contact made
- **Qualified** (Blue) - Needs identified
- **Proposal Sent** (Purple) - Quote sent
- **Won** (Slate) - Closed deal
- **Lost** (Slate) - Not qualified

## Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test: `npm test`
3. Commit: `git commit -m "feat: description"`
4. Push: `git push origin feature/your-feature`
5. Open pull request on GitHub

## Scripts

```bash
# Frontend
npm run dev:frontend      # Start dev server on 5173
npm run build --prefix frontend     # Production build
npm test --prefix frontend         # Run tests

# Backend
npm run dev:backend       # Start dev server on 3001
npm run seed --prefix backend       # Populate sample data
npm test               # Run integration tests

# Docker
docker compose up --build    # Start all services
docker compose down          # Stop all services
```

## Known Issues and TODO

- Add pagination (currently loads all leads)
- Add role-based authentication
- Add soft deletes for audit trail
- Implement rate limiting
- Add phone number validation
- Upgrade Prisma to latest major version

## Contact and Support

For issues, questions, or contributions, please:
- Open an [issue](https://github.com/yourusername/LeadFlow/issues)
- Submit a [pull request](https://github.com/yourusername/LeadFlow/pulls)

## Contributors

This project is maintained by the following contributors:

- BugHunterX2101 <veditagrawal21@gmail.com>

## License

MIT License - see LICENSE file for details

---

**Built for sales teams**

Last updated: May 2026
