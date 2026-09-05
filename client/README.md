# Frontend (Client)

## Project Description
React frontend for the Evotec form management assignment. Covers customer
registration/login, an authenticated application form, a separate admin
login, and an admin dashboard with filter, search, edit, and delete.

## Tech Stack
- **React** (Vite)
- **React Router** (`react-router-dom`) for page routing and protected routes
- **Tailwind CSS v4** for styling
- **Axios** for API requests
- **Context API** for auth/session state (JWT stored in `localStorage`)

## Setup Instructions
```bash
cd client
npm install
# copy .env.example to .env and set VITE_API_URL to your backend URL
npm run dev
```
Runs on `http://localhost:5173` by default. Requires the backend
(`/server`) to be running separately — see the server README for that setup.

## Environment Variables
See `.env.example`:
```
VITE_API_URL=http://localhost:5000/api
```
Point this at wherever your backend is deployed/running.

## Pages
| Route | Page | Access |
|-------|------|--------|
| `/` | Home | Public |
| `/register` | Customer Register | Public |
| `/login` | Customer Login | Public |
| `/application` | Application Form | Customer only (protected) |
| `/admin/login` | Admin Login | Public |
| `/admin/dashboard` | Admin Dashboard | Admin only (protected) |

## Auth Flow
- On login (customer or admin), the backend returns an access token, a
  refresh token, and the user object. These are stored in `localStorage`
  and the access token is attached automatically to every API request via
  an axios interceptor (`src/api/axios.js`).
- `ProtectedRoute` (`src/components/ProtectedRoute.jsx`) checks the current
  user's role before rendering a protected page, redirecting to the
  appropriate login page otherwise.
- Access tokens expire after 15 minutes (matches the backend's
  `JWT_ACCESS_EXPIRES`). There is currently no silent refresh flow — an
  expired token surfaces as an "invalid or expired token" error, and the
  user needs to log in again.

## Project Structure
```
client/
├── src/
│   ├── api/          # axios instance with auth interceptor
│   ├── components/   # shared components (ProtectedRoute)
│   ├── context/       # AuthContext (login/logout/session state)
│   ├── pages/         # the 6 page components
│   ├── App.jsx        # route definitions
│   └── main.jsx        # app entrypoint (Router + AuthProvider wrapper)
```

## Known Limitations
- No silent token refresh — expired sessions require re-login.
- JWT is stored in `localStorage`, which is simple but technically
  vulnerable to XSS; a production version would likely use httpOnly cookies
  instead.