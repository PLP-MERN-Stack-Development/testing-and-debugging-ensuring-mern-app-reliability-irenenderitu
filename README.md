# MERN Bug Tracker

A comprehensive bug tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js) with extensive testing and debugging implementations.

## Features

- 🐛 Create, read, update, and delete bug reports
- 🎯 Track bug status (open, in-progress, resolved, closed)
- ⚡ Priority levels (low, medium, high, critical)
- 🔍 Filter bugs by status
- 📝 Detailed bug reporting with steps to reproduce
- 🛡️ Comprehensive error handling and validation
- 🧪 Extensive test coverage (unit, integration)

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- Jest & Supertest for testing
- MongoDB Memory Server for testing

### Frontend
- React 18
- Vite for build tooling
- React Testing Library & Jest
- Axios for API calls

## Project Structure
mern-bug-tracker/
├── server/ # Express.js backend
│ ├── src/
│ │ ├── controllers/ # Route controllers
│ │ ├── models/ # Mongoose models
│ │ ├── routes/ # API routes
│ │ ├── middleware/ # Custom middleware
│ │ └── utils/ # Utility functions
│ └── tests/ # Backend tests
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── hooks/ # Custom React hooks
│ │ └── utils/ # Frontend utilities
│ └── tests/ # Frontend tests
└── README.md

text

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-bug-tracker
Install dependencies

bash
npm run install:all
Environment Setup

Create .env file in the server directory:

text
MONGODB_URI=mongodb://localhost:27017/bugtracker
PORT=5000
NODE_ENV=development
Start the application

bash
# Development mode (both client and server)
npm run dev

# Or start separately:
npm run dev:server  # Backend on port 5000
npm run dev:client  # Frontend on port 3000
Testing
Backend Testing
bash
cd server
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
Frontend Testing
bash
cd client
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
Run All Tests
bash
npm test
Testing Strategy
Backend Tests
Unit Tests: Validation utilities, middleware functions

Integration Tests: API endpoints with MongoDB Memory Server

Test Coverage: Aim for 70%+ coverage

Frontend Tests
Unit Tests: React components, custom hooks

Integration Tests: User workflows, form submissions

Testing Library: Focus on user-centric testing

Debugging Techniques
Server-Side Debugging
Console Logging: Strategic debug logs in controllers

Node Inspector: Use npm run debug in server directory

Error Handling: Comprehensive error middleware

API Testing: Use tools like Postman or Thunder Client

Client-Side Debugging
React DevTools: Component inspection and state debugging

Chrome DevTools: Network requests and console logging

Error Boundaries: Graceful error handling in React

API Interceptors: Request/response logging

Common Debugging Scenarios
Database Connection Issues: Check MongoDB URI and network

API Endpoint Errors: Verify route handlers and middleware

Component State Issues: Use React DevTools for state inspection

Form Validation Problems: Check client and server validation

Error Handling
Backend Error Handling
Global error handling middleware

Async error wrapper utility

MongoDB error parsing

Validation error formatting

Frontend Error Handling
React Error Boundaries

API error interception

User-friendly error messages

Form validation feedback

API Endpoints
Method	Endpoint	Description
GET	/api/bugs	Get all bugs (with optional filtering)
GET	/api/bugs/:id	Get bug by ID
POST	/api/bugs	Create new bug
PUT	/api/bugs/:id	Update bug
DELETE	/api/bugs/:id	Delete bug
GET	/api/health	Health check
Sample Bug Data
json
{
  "title": "Button not responding",
  "description": "Submit button does nothing when clicked",
  "status": "open",
  "priority": "high",
  "reporter": "John Doe",
  "assignee": "Jane Smith",
  "stepsToReproduce": [
    "Navigate to login page",
    "Enter credentials",
    "Click submit button"
  ],
  "environment": "Chrome 115, Windows 10"
}
Contributing
Follow the testing guidelines

Ensure all tests pass before submitting

Maintain code coverage standards

Use descriptive commit messages

License
MIT License - feel free to use this project for learning and development.

text

## Setup Instructions

1. **Create the project structure:**
```bash
mkdir mern-bug-tracker
cd mern-bug-tracker
Initialize the root package.json:

bash
npm init -y
Create server and client directories and follow the structure above

Install dependencies in each directory:

bash
# Server
cd server
npm install

# Client  
cd ../client
npm install
Set up MongoDB:

Install MongoDB locally or use MongoDB Atlas

Update the MONGODB_URI in server/.env

Run the application:

bash
# From root directory
npm run dev
This comprehensive Bug Tracker application demonstrates systematic testing and debugging practices in a MERN stack application, meeting all the requirements specified in the assignment.

