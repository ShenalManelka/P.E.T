# MERN Stack Project

This is a full-stack web application built with the MERN (MongoDB, Express, React, Node.js) stack.

## Project Structure

The project is divided into two main directories:

- `client`: Contains the React frontend application.
- `server`: Contains the Node.js and Express backend application.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (which includes npm)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Set up the server:**
   - Navigate to the `server` directory:
     ```bash
     cd server
     ```
   - Install the dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `server` directory and add the following environment variables:
     ```
     MONGO_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-jwt-secret>
     ```
   - Start the server:
     ```bash
     npm start
     ```
     Or for development with nodemon:
     ```bash
     npm run dev
     ```

3. **Set up the client:**
   - Navigate to the `client` directory from the root:
     ```bash
     cd ../client
     ```
   - Install the dependencies:
     ```bash
     npm install
     ```
   - Start the client development server:
     ```bash
     npm run dev
     ```

## Technologies Used

### Frontend

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### Backend

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JSON Web Tokens (JWT)](https://jwt.io/) for authentication
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) for password hashing
- [Multer](https://www.npmjs.com/package/multer) for file uploads
