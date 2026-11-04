#!/bin/bash

# Curated Commerce + YOUPI-PG Sovereign Payment Gateway - Startup Script

echo "🛍️  Curated Commerce - Starting Development Environment with YOUPI-PG"
echo ""

# Check if .env exists
if [ ! -f "server/.env" ]; then
    echo "❌ Error: server/.env not found!"
    echo "Please configure your database connection first."
    echo "See SETUP.md for instructions."
    exit 1
fi

# Check if Prisma Client is generated
if [ ! -d "server/node_modules/@prisma/client" ]; then
    echo "⚙️  Generating Prisma Client..."
    cd server && npm run db:generate && cd ..
fi

# Ensure YOUPI-PG database exists
if [ ! -f "YouPI-PG/data/youpi_pg.sqlite" ]; then
    echo "⚙️  Initializing YOUPI-PG Database..."
    cd YouPI-PG && npm run db:setup && cd ..
fi

echo "🚀 Starting servers & gateway..."
echo ""
echo "📍 Curated Commerce Backend: http://localhost:4000"
echo "📍 Curated Commerce Frontend: http://localhost:5173"
echo "📍 YOUPI-PG Payment Core API: http://localhost:6100"
echo "📍 YOUPI-PG Checkout Portal:  http://127.0.0.1:7000"
echo "📍 YOUPI-PG Merchant Control: http://localhost:6001"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# 1. Start YOUPI-PG Gateway Supervisor
cd YouPI-PG
node scripts/dev.js > /dev/null 2>&1 &
YOUPI_PID=$!
cd ..

# 2. Start Curated Commerce backend
cd server
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend and gateway to boot
sleep 2

# 3. Start Curated Commerce frontend
cd client
npm run dev &
FRONTEND_PID=$!
cd ..

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all servers and payment gateway..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    kill $YOUPI_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

# Wait for all processes
wait
