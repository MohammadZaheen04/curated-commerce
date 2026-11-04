# 🚀 QUICK START - Your Project is Ready!

## ✅ Setup Complete!

Your database is connected and configured. Everything is ready to run!

## Run Your Project

### Option 1: Using the script
```bash
./start.sh
```

### Option 2: Manual (recommended for development)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

## Your URLs

- **Backend API**: http://localhost:4000
- **Frontend**: http://localhost:5173
- **Health Check**: http://localhost:4000/health
- **Products API**: http://localhost:4000/api/v1/products

## Database

✅ **Connected to Neon PostgreSQL**
✅ **All tables created** (9 tables: User, Product, Category, Review, etc.)

View/edit your data:
```bash
cd server
npm run db:studio
```

## Test the API

```bash
# Health check
curl http://localhost:4000/health

# Get products (empty for now)
curl http://localhost:4000/api/v1/products

# Login (after creating a user)
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

## Next Steps

### 1. Add Sample Data

Open Prisma Studio to add users and products:
```bash
cd server
npm run db:studio
```

Or create via API (see README.md for endpoints)

### 2. Start Building the UI

Edit `client/src/App.jsx` to build your frontend.

### 3. Test Authentication

Create a user in Prisma Studio, then test the login endpoint.

## Available API Endpoints

### Public
- `GET /health` - Server health
- `GET /api/v1/products` - Product catalog
- `POST /api/v1/auth/login` - User login  
- `POST /api/v1/auth/refresh` - Refresh token

### Protected (Need auth token)
- `POST /api/v1/admin/products` - Create product (EDITOR/ADMIN)
- `PATCH /api/v1/admin/accounts/:id/status` - Update account (ADMIN)

## Useful Commands

```bash
# Server
cd server
npm run dev              # Start dev server
npm run db:studio        # Open database GUI
npm run db:push          # Update database schema

# Client  
cd client
npm run dev              # Start dev server
npm run build            # Build for production
```

## Configuration

### Environment Variables

**Server** (`server/.env`):
- ✅ `PORT=4000`
- ✅ `DATABASE_URL` - Connected to Neon
- ✅ `JWT_ACCESS_SECRET` - Set (change in production)
- ✅ `JWT_REFRESH_SECRET` - Set (change in production)

**Client** (`client/.env`):
- ✅ `VITE_API_BASE_URL=http://localhost:4000/api/v1`

## Troubleshooting

### Port in use?
Change `PORT=4001` in `server/.env`

### Can't connect to database?
Check your connection string in `server/.env`

### Frontend can't reach API?
1. Make sure backend is running on port 4000
2. Check `client/.env` has correct URL

## 📚 Full Documentation

- **README.md** - Complete API docs & architecture
- **SETUP.md** - Detailed setup guide
- **START_HERE.md** - Getting started guide

---

## 🎉 You're All Set!

Both your database and code are ready. Just start the servers and begin building!

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

**Happy coding! 🚀**
