# 🚀 Quick Setup Guide

Follow these steps to get your Curated Commerce platform running.

## Step 1: Get a Database

You need a PostgreSQL database. Pick one option:

### Option A: Neon (Recommended - Free tier available)
1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Copy the connection string (looks like: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname`)

### Option B: Supabase (Free tier available)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings → Database
4. Copy the "Connection string" in "Connection pooling" mode

### Option C: Local PostgreSQL
```bash
# macOS (using Homebrew)
brew install postgresql@16
brew services start postgresql@16
createdb curated_commerce
```
Your connection string will be: `postgresql://localhost:5432/curated_commerce`

## Step 2: Configure Server

```bash
cd server

# Edit the .env file and replace the DATABASE_URL
nano .env
```

Replace this line:
```
DATABASE_URL="postgresql://user:password@localhost:5432/curated_commerce?schema=public"
```

With your actual database URL.

**Optional but recommended:** Generate secure JWT secrets:
```bash
# Run this to generate a secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Step 3: Initialize Database

```bash
# Push the schema to your database (creates all tables)
npm run db:push
```

You should see output like:
```
✔ Database now in sync with schema
✔ Created 9 tables: User, Category, Product, etc.
```

## Step 4: Start the Server

```bash
# Start server in development mode (auto-reloads on changes)
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3000
📝 Environment: development
```

Test it:
```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","timestamp":"..."}
```

## Step 5: Start the Client

Open a **new terminal window**:

```bash
cd client

# Install dependencies (if not done)
npm install

# Start the dev server
npm run dev
```

Client will run at: http://localhost:5173

## ✅ You're Ready!

Both servers should now be running:
- **Backend API**: http://localhost:3000
- **Frontend**: http://localhost:5173

## Next Steps

1. **Create a test user** - Open Prisma Studio to add data:
   ```bash
   cd server
   npm run db:studio
   ```
   
2. **Test the API** - Use the health check endpoint or try login

3. **Build the UI** - Start editing `client/src/App.jsx`

## Common Issues

### "Prisma Client not generated"
```bash
cd server
npm run db:generate
```

### "Can't connect to database"
- Check your `DATABASE_URL` in `server/.env`
- Ensure your database is running
- For Neon/Supabase, check your internet connection

### Port already in use
Change the port in `server/.env`:
```
PORT=3001
```

### Client can't connect to API
- Make sure both servers are running
- Check `CLIENT_URL` in `server/.env` matches your client URL
- Check CORS settings

## Development Workflow

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev

# Terminal 3 - Database GUI (optional)
cd server
npm run db:studio
```

## Need Help?

Check the main [README.md](./README.md) for API documentation and architecture details.
