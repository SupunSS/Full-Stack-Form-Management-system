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

Base URL: `http://localhost:5000/api`

### Auth

#### POST `/auth/register`
Public. Registers a new customer.

Request body:
```json
{
  "email": "customer1@test.com",
  "password": "test1234",
  "confirmPassword": "test1234"
}
```
Responses: `201` created · `400` validation error / password mismatch · `409` email already registered

---

#### POST `/auth/login`
Public. Customer login only (users with role `ADMIN` are rejected here).

Request body:
```json
{
  "email": "customer1@test.com",
  "password": "test1234"
}
```
Response `200`:
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { "id": "...", "email": "...", "role": "CUSTOMER" }
}
```
Responses: `200` success · `400` missing fields · `401` invalid credentials

---

#### POST `/auth/admin/login`
Public. Admin login only (users with role `CUSTOMER` are rejected here).

Request body:
```json
{
  "email": "admin@evotec.software",
  "password": "admin123"
}
```
Responses: `200` success (same shape as customer login, `role: "ADMIN"`) · `400` missing fields · `401` invalid credentials

---

#### POST `/auth/admin/create`
**Protected — Admin only.** Requires `Authorization: Bearer <admin accessToken>`.

Creates a new admin with an auto-generated password.

Request body:
```json
{
  "email": "admin2@evotec.software"
}
```
Response `201`:
```json
{
  "message": "Admin created successfully",
  "admin": { "id": "...", "email": "admin2@evotec.software", "role": "ADMIN" },
  "generatedPassword": "a1b2c3d4e5f6"
}
```
Responses: `201` created · `400` missing email · `401` no/invalid token · `403` valid token but not an admin · `409` email already registered

> The very first admin account can't be created through this endpoint (nothing to authenticate with yet). Run `npm run seed:admin` once to create it directly via a script — see Setup Instructions above.

---

### Submissions

#### POST `/submissions`
**Protected — Customer only.** Requires `Authorization: Bearer <customer accessToken>`.

Request body:
```json
{
  "firstName": "supun",
  "lastName": "sankalpa",
  "email": "supun.sankalpa@test.com",
  "gender": "MALE",
  "mobileNumber": "0771234567",
  "address": "123 Galle Road, Colombo",
  "feedback": "Great service"
}
```
Notes:
- `feedback` is optional, everything else required.
- `gender` must be one of `MALE`, `FEMALE`, `OTHER`.
- `mobileNumber` must match a Sri Lankan local format (`07XXXXXXXX`).
- `userCreated` and `dateCreated` are set automatically from the authenticated user — not accepted from the request body.

Responses: `201` created · `400` validation error · `401`/`403` auth failures · `409` email already submitted

---

#### GET `/submissions`
**Protected — Admin only.** Requires `Authorization: Bearer <admin accessToken>`.

Query params (optional, combinable):
- `?gender=MALE` — filter by gender (`MALE` | `FEMALE` | `OTHER`)
- `?search=john` — case-insensitive partial match on first or last name

Example: `/submissions?gender=MALE&search=jo`

Response `200`:
```json
{
  "count": 2,
  "submissions": [ { "...": "...", "userCreated": { "email": "..." } } ]
}
```
Responses: `200` success · `400` invalid gender value · `401`/`403` auth failures

---

#### PUT `/submissions/:id`
**Protected — Admin only.**

Request body: any subset of submission fields to update, e.g.:
```json
{ "address": "456 New Address, Kandy" }
```
`userModified` and `dateModified` are set automatically from the authenticated admin.

Responses: `200` updated · `400` validation error / invalid ID · `401`/`403` auth failures · `404` not found

---

#### DELETE `/submissions/:id`
**Protected — Admin only.**

Responses: `200` deleted · `400` invalid ID format · `401`/`403` auth failures · `404` not found

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