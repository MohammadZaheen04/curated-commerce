# Curated Commerce

A curated e-commerce platform with editorial content and strict quality controls.

## Project Structure

```
curated-commerce/
├── client/          # React + Vite frontend
└── server/          # Express + Prisma backend
```

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon, Supabase, or local)

## Setup Instructions

### 1. Database Setup

Get a PostgreSQL connection string from:
- [Neon](https://neon.tech) (recommended for development)
- [Supabase](https://supabase.com)
- Local PostgreSQL installation

### 2. Server Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment variables
# Edit server/.env and add your DATABASE_URL
nano .env

# Generate Prisma Client
npm run db:generate

# Push database schema (creates tables)
npm run db:push

# Start development server
npm run dev
```

Server will run at: http://localhost:3000

### 3. Client Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

Client will run at: http://localhost:5173

## Environment Variables

### Server (.env)

```bash
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:5173
DATABASE_URL="your-postgresql-connection-string"
JWT_ACCESS_SECRET="your-secret-min-32-chars"
JWT_REFRESH_SECRET="your-secret-min-32-chars"
```

## Available Scripts

### Server

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio (database GUI)

### Client

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Endpoints

### Public Routes

- `GET /health` - Health check
- `GET /api/v1/products` - Get curated product catalog
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token

### Protected Routes (Require Authentication)

- `POST /api/v1/admin/products` - Create product (EDITOR/ADMIN)
- `PATCH /api/v1/admin/accounts/:id/status` - Update account status (ADMIN)

## Database Schema

Key models:
- **User** - Authentication and role-based access (CUSTOMER, EDITOR, ADMIN)
- **Product** - Curated products with strict quality gates (min 4.2 rating)
- **Category** - Product categorization
- **Review** - User product reviews
- **EditorialPost** - Editorial content linking to products
- **AuditLog** - Account governance audit trail

## Features

- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Strict product quality gates (minimum 4.2 rating)
- External CDN media hosting requirement
- Account governance system with audit logging
- Auto product review when ratings drop below 4.0

## Tech Stack

**Frontend:**
- React 19
- Vite
- Axios

**Backend:**
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT authentication
- Zod validation
- bcryptjs for password hashing

## Next Steps

1. Add your database connection string to `server/.env`
2. Run `npm run db:push` to create database tables
3. Create a test user in the database
4. Start building the frontend UI

## License

ISC
