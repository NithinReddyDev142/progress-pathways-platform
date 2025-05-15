
# Learning Management System (LMS)

A full-featured Learning Management System built with React, Node.js, Express, and MongoDB.

## Features

- **User Authentication**:
  - Email & Password authentication
  - Google OAuth integration
  - Role-based access control (Admin, Teacher, Student)

- **Course Management**:
  - Create, edit, and delete courses (Teachers & Admins)
  - Browse course catalog
  - Enroll in courses
  - Track learning progress

- **User Dashboard**:
  - Role-specific dashboards
  - Progress tracking
  - Course management
  - Profile management

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB Atlas account or local MongoDB instance
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd lms-project
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ..
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the server directory
   - Use `server/.env.sample` as a template
   - Update with your MongoDB connection string and JWT secret

4. Seed the database with sample data:
   ```bash
   # From the server directory
   node seed/seedUsers.js
   node seed/seedCourses.js
   ```

### Running the Application

1. Start the server:
   ```bash
   # From the server directory
   npm start
   ```

2. Start the client:
   ```bash
   # From the root directory
   npm run dev
   ```

3. Access the application:
   - Open your browser and navigate to `http://localhost:5173`

### Sample User Accounts

- **Admin**:
  - Email: admin@example.com
  - Password: password123

- **Teacher**:
  - Email: teacher@example.com
  - Password: password123

- **Student**:
  - Email: student@example.com
  - Password: password123

## Technology Stack

- **Frontend**:
  - React with TypeScript
  - Vite
  - React Router
  - Tailwind CSS
  - Shadcn UI Components
  - Tanstack Query

- **Backend**:
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication

## Project Structure

- `/server` - Backend Node.js/Express server
  - `/models` - Mongoose schemas
  - `/routes` - API routes
  - `/middleware` - Custom middleware
  - `/config` - Configuration files
  - `/seed` - Database seeding scripts

- `/src` - Frontend React application
  - `/components` - Reusable UI components
  - `/contexts` - Context API providers
  - `/pages` - Page components
  - `/services` - API service modules
  - `/utils` - Utility functions
  - `/types` - TypeScript type definitions

## License

This project is licensed under the MIT License - see the LICENSE file for details.
