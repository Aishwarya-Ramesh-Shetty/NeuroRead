# Dyslexia Learning Platform - Architecture & Flow

This document explains both frontend and backend architecture for the current MVP.

## 1) High-level architecture

- **Frontend (planned):** React (Vite), Tailwind CSS, React Router, Context API
- **Backend (implemented):** Node.js + Express (MVC + Services)
- **Database (implemented):** MongoDB + Mongoose
- **Auth (implemented):** JWT + bcrypt

---

## 2) Frontend architecture (planned structure)

```txt
frontend/src/
├── assets/        # static files (images/audio/icons)
├── components/    # reusable UI pieces
├── context/       # auth/global state providers
├── hooks/         # reusable custom hooks
├── pages/         # route-level pages
├── routes/        # route definitions and guards
├── services/      # API client modules
└── utils/         # helpers/constants
```

## Intended frontend flow

1. User registers/logs in.
2. JWT token stored in app state (and usually localStorage/sessionStorage).
3. Protected routes use auth context.
4. Game pages call backend APIs for game list/questions.
5. After each game, frontend posts attempt to progress API.
6. Dashboard page fetches and displays progress summary.

---

## 3) Backend architecture (implemented)

```txt
backend/src/
├── config/        # env + database connection
├── controllers/   # HTTP request/response orchestration
├── middlewares/   # auth, validation, error handling
├── models/        # Mongoose schemas + indexes
├── routes/        # route definitions
├── services/      # business logic
├── utils/         # shared helpers (JWT, response format, errors)
├── validators/    # request payload validators
├── app.js         # express app and middleware wiring
└── server.js      # server bootstrap + DB connection
```

## Layer responsibilities

- **Routes:** Map endpoint → middleware → controller
- **Controller:** Parse request context, call services, shape response
- **Service:** Contains domain logic (auth/game/progress)
- **Model:** Defines data schema, validation and indexes
- **Middleware:** Cross-cutting concerns (auth, validation, errors)
- **Utils:** Reusable technical helpers

---

## 4) Data model overview

## Users
- `name`
- `email` (unique, indexed)
- `passwordHash`
- `createdAt`

## Games
- `gameName`
- `gameType`
- `description`
- `createdAt`

## Questions
- `gameId` (ref Games, indexed)
- `questionText`
- `imageUrl`
- `options[]`
- `correctAnswer`
- `audioUrl`
- `createdAt`

## Attempts
- `userId` (ref Users, indexed)
- `gameId` (ref Games, indexed)
- `score`
- `timeTaken`
- `createdAt`

---

## 5) Request flow (end-to-end)

1. Client sends HTTP request to Express route.
2. Route applies middlewares (auth + payload validation if needed).
3. Controller receives clean/authorized request.
4. Controller calls service function.
5. Service interacts with Mongoose models.
6. Service returns result or throws controlled `AppError`.
7. Controller sends standardized success response.
8. On errors, centralized `errorHandler` returns secure error response.

---

## 6) Auth flow

### Register
1. Validate payload.
2. Check existing email.
3. Hash password using bcrypt.
4. Save user.
5. Create JWT token.
6. Return token + user profile.

### Login
1. Validate payload.
2. Fetch user by email (include `passwordHash`).
3. Compare plain password vs hash.
4. Issue JWT token.
5. Return token + user profile.

### Protected endpoint (`requireAuth`)
1. Read `Authorization` header.
2. Verify JWT.
3. Load user by token `userId`.
4. Attach user to `req.user`.
5. Continue to controller.

---

## 7) Progress flow

### Record attempt
- Validate payload (`gameId`, `score`, `timeTaken`)
- Verify game exists
- Save attempt with `userId` from JWT context

### Summary
- Aggregate attempts per user:
  - total attempts
  - average score
  - best score
  - total time
- Aggregate attempts grouped by game for dashboard breakdown

---

## 8) Security practices implemented

- Password hashing with bcrypt (cost factor 12)
- JWT-based auth guard for protected APIs
- Environment variable management via `.env`
- Validation middleware for incoming payloads
- Centralized error handler with safe production messages
- CORS configured by environment variable

---

## 9) API surface (current)

## Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Games
- `GET /api/games`
- `GET /api/games/:gameId/questions`

## Progress
- `POST /api/progress/attempt`
- `GET /api/progress/summary`
