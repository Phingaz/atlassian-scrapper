#!/bin/bash

# Start the FastAPI server in development mode
echo "Starting FastAPI server..."
cd server
uvicorn app.server:app --host 0.0.0.0 --port 3001 --reload &
FASTAPI_PID=$!

# Start the Next.js client in development mode
echo "Starting Next.js client..."
cd ..
npm run dev --prefix ./client &
NEXTJS_PID=$!

# Wait for both processes to complete
echo "FastAPI server PID: $FASTAPI_PID"
echo "Next.js client PID: $NEXTJS_PID"

# Trap SIGINT (Ctrl+C) to kill both processes
trap "kill $FASTAPI_PID $NEXTJS_PID" SIGINT

# Wait for the processes to finish
wait $FASTAPI_PID $NEXTJS_PID
