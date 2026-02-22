# TaskManager (MERN Stack)

A full-stack project management application where users can create projects and manage tasks securely using JWT authentication.

---

## How to Run Locally

### Clone the repository

```bash
git clone https://github.com/dipankar049/primetrade-task.git
cd primetrade-task
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend` folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run backend:

```bash
npm run dev
```

---

### Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend`:

```
VITE_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

App will run at:
```
http://localhost:5173
```

---

## Folder Structure

```
root/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│       ├── components/
│       ├── pages/
│       ├── data/
│       └── App.jsx
│
└── docs/
    └── TaskManager.postman_collection.json
```

---

## Authentication

- JWT-based authentication
- Protected routes using middleware
- Token stored in localStorage
- Authorization header format:
  ```
  Authorization: Bearer <token>
  ```

---

## Future Improvements & Scaling Ideas

If this project grows in users, these improvements can be made:

- Add email verification during signup
- Store JWT in httpOnly cookies for better security
- Add basic rate limiting to prevent spam requests
- Add password reset functionality
- Add pagination for projects and tasks
- Add dark mode support
- Deploy backend and frontend separately (e.g., Render + Vercel)
- Add basic logging for debugging production issues
- Use MongoDB indexes for faster query performance

---

## Tech Stack

- Frontend: React, TailwindCSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- API Testing: Postman

---