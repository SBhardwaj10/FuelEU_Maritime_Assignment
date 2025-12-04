# Fuel EU Backend

Node.js + TypeScript backend for Fuel EU Dashboard.

## Features
- Hexagonal architecture (core, ports, adapters)
- PostgreSQL persistence
- APIs for routes, compliance, banking, pooling
- Unit and integration tests

## Setup
```sh
cd backend
npm install
npm run build
npm run dev
npm run test
```

## Database
- See `infrastructure/db` for schema and migrations
- Seed data includes five routes and baseline
