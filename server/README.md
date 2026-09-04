# Evotec Technical Assignment — Full-Stack Form Management App

## Project Description
A full-stack web application with customer/admin authentication, role-based
access control, and a CRUD form submission system with filtering and search.

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas), Mongoose
- **Auth:** JWT (access + refresh tokens), bcrypt for password hashing

## Setup Instructions

### Backend
```bash
cd server
npm install
# copy .env.example to .env and fill in real values
npm run dev
```
Server runs on `http://localhost:5000` by default.

### Frontend
```bash
cd client
npm install
npm run dev
```

## Environment Variables
See `.env.example` for the full list. Notes:
- `MONGODB_URI`: if your network blocks SRV DNS lookups (symptom: `querySrv
  ECONNREFUSED` on connect), use the standard (non-SRV) connection string
  instead. In Atlas: Connect → Drivers → toggle off "SRV Connection String".
- Don't forget to whitelist your IP (or `0.0.0.0/0` for local dev) under
  Atlas → Network Access.

## API Endpoints
_(filled in as routes are built)_

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register a new customer |
| POST | /api/auth/login | Public | Customer login |
| POST | /api/auth/admin/login | Public | Admin login |
| POST | /api/auth/admin/create | Admin only | Create a new admin account |
| POST | /api/submissions | Customer only | Submit a form |
| GET | /api/submissions | Admin only | Get all submissions (supports ?gender= and ?search=) |
| PUT | /api/submissions/:id | Admin only | Update a submission |
| DELETE | /api/submissions/:id | Admin only | Delete a submission |

## Project Structure
```
server/
├── config/       # DB connection
├── models/       # Mongoose schemas
├── controllers/  # Route logic
├── routes/       # Express route definitions
├── middleware/   # JWT auth + role guards
└── server.js     # Entrypoint
```