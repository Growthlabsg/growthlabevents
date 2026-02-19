#!/bin/bash

echo "🚀 Starting GrowthLab Events Development Server..."
echo ""

# Kill any existing Next.js processes
echo "Clearing existing processes..."
pkill -f "next dev" 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 1

# Clear cache
echo "Clearing cache..."
rm -rf .next

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the dev server
echo ""
echo "Starting Next.js dev server..."
echo "Server will be available at http://localhost:3000"
echo ""
npm run dev

