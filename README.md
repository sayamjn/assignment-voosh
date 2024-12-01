Task Management Application
A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring drag-and-drop task organization, comprehensive user authentication, and visuals.


✨ Features

Authentication

Email/Password login system
Google OAuth integration
JWT-based authentication
Protected routes

Task Management

board (TODO, IN PROGRESS, DONE)
Drag-and-drop task organization
Task priority levels and due dates
Task filtering and sorting capabilities
Task labels

User Features

Profile customization with avatar support
File uploads using Cloudinary

🛠 Tech Stack

Frontend

React.js with Vite
React Router v6
React DND for drag-and-drop
Tailwind CSS for styling
@react-oauth/google for authentication
Axios for API requests
Context API for state management

Backend

Node.js & Express.js
MongoDB with Mongoose
Passport.js for authentication
JWT for token-based auth
Express Validator for input validation
Cloudinary for image storage

🚀 Getting Started

Prerequisites

Node.js (v14 or higher)
MongoDB
Google Cloud Console account (for OAuth)
Cloudinary account (for image upload)

Installation

Clone the repository

git clone https://github.com/sayamjn/assignment-voosh
cd task-management

Install Backend Dependencies

cd backend
npm install

Install Frontend Dependencies

cd frontend
npm install

Environment Setup

Backend (.env)

PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development

Frontend (.env)

VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
Running the Application

Start MongoDB

mongod

Start the Backend Server

cd backend
npm run dev

Start the Frontend Development Server

cd frontend
npm run dev

The application will be available at http://localhost:5173

📁 Project Structure

task-management/
├── backend/
│   ├── config/       # Configuration files
│   ├── middleware/   # Custom middleware
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── tests/        # Test files
│   └── index.js      # Entry point
└── frontend/
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── contexts/     # Context providers
    │   ├── pages/        # Page components
    │   ├── services/     # API services
    │   └── App.jsx       # Root component
    ├── public/
    └── index.html

🔄 API Endpoints

Authentication

POST /api/auth/signup - Register new user
POST /api/auth/login - Login user
POST /api/auth/google - Google OAuth login
PATCH /api/auth/profile - Update user profile

Tasks

GET /api/tasks - Get all tasks
POST /api/tasks - Create new task
PATCH /api/tasks/:id - Update task
DELETE /api/tasks/:id - Delete task
PATCH /api/tasks/:id/status - Update task status
GET /api/tasks/overdue - Get overdue tasks

Users

GET /api/users/me - Get current user
PATCH /api/users/profile - Update user profile

🧪 Testing

Run backend tests:

cd backend

npm test
