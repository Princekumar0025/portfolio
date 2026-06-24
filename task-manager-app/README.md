# MERN Task Management Application

A full-stack Task Management Web Application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **User Authentication:** Secure registration and login using JWT and bcrypt.
- **Task Management:** Create, read, update, and delete tasks.
- **Task Status:** Toggle tasks between pending and completed.
- **Search & Filter:** Search tasks by title and filter by status (Bonus).
- **Pagination:** Backend-driven pagination for efficient data loading (Bonus).
- **Premium UI:** Custom responsive design using CSS variables, modern typography (Outfit), and smooth micro-animations.

## Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local instance or Atlas URI)

## Setup Instructions

### 1. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd task-manager-app/backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server (development mode):
```bash
npm run dev
# or
node server.js
```

### 2. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd task-manager-app/frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 3. Usage
- The backend API will run on `http://localhost:5000`
- The React application will run on `http://localhost:5173` (or the port Vite assigns)
- Open your browser and navigate to the frontend URL to start using the app!

## Folder Structure
- `backend/`: Express server, MongoDB models, controllers, and routes.
- `frontend/`: React application (Vite), components, contexts, and premium CSS design.
