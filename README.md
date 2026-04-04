# Billing API

A scalable REST API for managing users, clients, invoices, payments, collection actions and basic stats.

Prerequisites: Node.js 22+, MongoDB instance

Environment
- Copy .env.example to .env and fill required fields

Install
```
npm install
```

Run
```
npm run dev

# Production
npm start
```

Usage
- JWT protected routes with RBAC: admin, manager, agent
- Pagination: ?page=1&limit=10
- Filtering: invoices by status via /api/invoices?status=paid

Tests
- `npm test` (basic skeletons in tests/)

Note: This is a minimal but production-oriented scaffold. Extend controllers/services and add validations, error handling, and tests as needed.
