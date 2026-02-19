#!/bin/bash

# Kill any existing Next.js processes
pkill -f "next dev" 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Clear cache
rm -rf .next node_modules/.cache

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the dev server
echo "Starting Next.js dev server on http://localhost:3000"
npm run dev

