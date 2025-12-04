# Fuel EU Dashboard

A full-stack solution for Fuel EU compliance management, featuring:
- Modern React frontend (Vite, TypeScript, Tailwind)
- Hexagonal Node.js backend (TypeScript, Express, PostgreSQL)
- AI agent workflow documentation

## Features
- Route management, baseline selection, and comparison
- Compliance balance (CB) calculation
- Banking and pooling logic
- Stylish, responsive UI

## Usage & AI Agent Features

### Start the Application
```sh
# Start frontend (Vite dev server)
cd frontend
npm install
npm run dev

# Start backend (Express + PostgreSQL)
cd backend
npm install
npm run build
npm run dev
```

### Run All Tests
```sh
# Frontend unit tests
cd frontend
npm run test

# Backend unit & integration tests
cd backend
npm run test
```

### AI Agent Workflow
- All code, refactoring, and integration steps are documented in `AGENT_WORKFLOW.md`.
- The project uses GitHub Copilot (GPT-4.1) for code generation, refactoring, and workflow automation.
- To view how AI was used, see:
  - Prompts and outputs
  - Validation and corrections
  - Observations and best practices

### Example AI-Driven Tasks
```sh
# Add a new API endpoint (describe in AGENT_WORKFLOW.md)
# Refactor a React component for accessibility
# Generate unit tests for a backend use-case
# Document incremental changes and validation steps
```

## Getting Started

### Frontend
```sh
cd frontend
npm install
npm run dev
npm run test
```

### Backend
```sh
cd backend
npm install
npm run build
npm run dev
npm run test
```

## Architecture
- Hexagonal (ports & adapters)
- Core business logic isolated from frameworks
- PostgreSQL for persistent data

## Docs
- See `AGENT_WORKFLOW.md` for agent usage
- See `REFLECTION.md` for project insights
