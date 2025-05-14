
# EduLearn LMS - Setup Instructions

This is a full-stack Learning Management System with a React frontend and Node.js Express backend.

## Prerequisites

Before you start, make sure you have the following installed:
- Node.js (v14 or later)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Project Structure

```
edulearn-lms/
├── src/                  # Frontend code (React + TypeScript + Vite)
├── server/               # Backend code (Node.js + Express)
├── public/               # Static assets
└── .env files            # Configuration files
```

## Setup Instructions

### Step 1: Clone the repository

```bash
git clone <repository-url>
cd edulearn-lms
```

### Step 2: Set up environment variables

Create `.env` files based on the provided samples:

1. For the frontend (in the project root):
```bash
cp src/.env.sample src/.env
```

2. For the backend (in the server directory):
```bash
cp server/.env.sample server/.env
```

Update the environment variables if needed, especially the MongoDB connection string if you're using MongoDB Atlas.

### Step 3: Install dependencies

1. Frontend dependencies:
```bash
npm install
```

2. Backend dependencies:
```bash
cd server
npm install
cd ..
```

### Step 4: Start MongoDB

If you're using a local MongoDB installation:

```bash
# Start MongoDB service (commands may vary based on your OS)
# For Linux:
sudo service mongod start
# For macOS with Homebrew:
brew services start mongodb-community
# For Windows:
# MongoDB should be running as a service
```

If you're using MongoDB Atlas, ensure your IP is whitelisted in the Atlas dashboard.

### Step 5: Initialize the database with sample data

```bash
node src/utils/initMongoDb.js
```

### Step 6: Start the backend server

```bash
cd server
npm run dev
# This will start the server on http://localhost:5000
```

### Step 7: Start the frontend development server

Open a new terminal window:

```bash
# From the project root directory
npm run dev
# This will start the Vite dev server on http://localhost:5173
```

### Step 8: Access the application

Open your browser and navigate to:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Demo Accounts

You can use the following demo accounts to test the application:
- Admin: admin@edulearn.com
- Teacher: jane.smith@edulearn.com
- Student: alex.wilson@edulearn.com

For the demo, any password will work.

## Development Notes

- The frontend uses React, TypeScript, and Tailwind CSS with shadcn/ui components
- The backend uses Express.js with MongoDB for data storage
- Frontend-backend communication happens via RESTful APIs

## Troubleshooting

If you encounter any issues:

1. Verify your MongoDB connection is working
2. Check that environment variables are correctly set
3. Ensure all dependencies are installed
4. Look for any console errors in the browser or terminal
