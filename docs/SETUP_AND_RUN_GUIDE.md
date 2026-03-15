# Dyslexia Learning Platform - Setup & Run Guide

This guide explains exactly what to install and how to run the project locally in VS Code.

## 1) What is included right now

- ✅ Backend: fully implemented (Node.js + Express + MongoDB)
- ✅ Frontend: folder structure only (as requested in current MVP phase)

So you can run and test the **backend APIs** immediately.

---

## 2) Prerequisites (Install these first)

## Required software

1. **Node.js (LTS)**
   - Recommended: Node.js **20.x LTS**
   - Includes `npm`
   - Verify:
     ```bash
     node -v
     npm -v
     ```

2. **MongoDB Community Server** (local DB) OR MongoDB Atlas URI
   - Local install recommended for beginners
   - Verify local mongo service is running

3. **VS Code extensions (recommended)**
   - ESLint
   - Prettier
   - REST Client (optional)

4. **Postman** (for API testing)

---

## 3) Project structure (important)

```txt
Dyslexia/
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
├── frontend/
│   └── src/ (folder structure only)
└── docs/
```

---

## 4) Backend setup steps

## Step 1: Open project in VS Code

Open the root folder:

```bash
cd /path/to/Dyslexia
```

## Step 2: Install backend dependencies

```bash
cd backend
npm install
```

If your network blocks `bcrypt` (common in restricted environments), try:
- Use your normal local internet connection
- Configure npm registry:
  ```bash
  npm config set registry https://registry.npmjs.org/
  npm install
  ```

## Step 3: Create `.env` file

Inside `backend/`, create `.env` by copying `.env.example`:

```bash
cp .env.example .env
```

Then update values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/dyslexia-platform
JWT_SECRET=your_super_strong_secret_key_here
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## Step 4: Start MongoDB

If using local MongoDB, ensure MongoDB service is running.

- macOS (Homebrew):
  ```bash
  brew services start mongodb-community
  ```
- Linux:
  ```bash
  sudo systemctl start mongod
  ```
- Windows:
  - Start MongoDB service from Services panel (or installed startup service)

## Step 5: Run backend server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Expected logs:
- `MongoDB connected successfully`
- `Server running on port 5000`

Health check:

```bash
curl http://localhost:5000/health
```

---

## 5) API testing with Postman

Base URL:

```txt
http://localhost:5000/api
```

## A) Register student
- Method: `POST`
- URL: `/auth/register`
- Body (JSON):

```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "password": "StrongPass123"
}
```

Copy `token` from response.

## B) Login student
- Method: `POST`
- URL: `/auth/login`
- Body:

```json
{
  "email": "aarav@example.com",
  "password": "StrongPass123"
}
```

## C) Protected APIs (`Authorization` header required)

Header format:

```txt
Authorization: Bearer <JWT_TOKEN>
```

Then test:
- `GET /auth/me`
- `GET /games`
- `GET /games/:gameId/questions`
- `POST /progress/attempt`
- `GET /progress/summary`

Attempt payload example:

```json
{
  "gameId": "66a18c4f2a2a123456789abc",
  "score": 85,
  "timeTaken": 120
}
```

---

## 6) Frontend status

Frontend currently includes only professional folder structure (no React app code yet):

```txt
frontend/src/
├── assets/
├── components/
├── context/
├── hooks/
├── pages/
├── routes/
├── services/
└── utils/
```

If you want, next step can be bootstrapping Vite + Tailwind in this structure.

---

## 7) Common issues and fixes

## Issue: `Missing required environment variable`
- Cause: `.env` missing keys
- Fix: Ensure all required keys exist:
  - `PORT`
  - `MONGO_URI`
  - `JWT_SECRET`
  - `CORS_ORIGIN`

## Issue: Mongo connection fails
- Check if MongoDB is running
- Verify `MONGO_URI`
- If Atlas, whitelist your IP and verify username/password in URI

## Issue: 401 Unauthorized
- Ensure token exists in header:
  `Authorization: Bearer <token>`
- Re-login if token expired

## Issue: No games/questions returned
- DB may be empty initially
- Insert seed data manually in MongoDB for `games` and `questions`

---

## 8) Recommended next improvements

- Add seed script for games/questions
- Add unit/integration tests (Jest + Supertest)
- Add request logging (`morgan`)
- Add rate limiting and security headers (`helmet`, `express-rate-limit`)
- Add Docker setup for consistent local/dev deployment
