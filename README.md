# Dyslexia Learning Platform (MVP) - Backend Implementation

## 1) Frontend Folder Structure (Vite + Tailwind only)

```txt
frontend/
└── src/
    ├── assets/
    ├── components/
    ├── context/
    ├── hooks/
    ├── pages/
    ├── routes/
    ├── services/
    └── utils/
```

## 2) Backend Folder Structure

```txt
backend/
├── .env.example
├── package.json
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    │   ├── db.js
    │   └── env.js
    ├── controllers/
    │   ├── authController.js
    │   ├── gameController.js
    │   └── progressController.js
    ├── middlewares/
    │   ├── authMiddleware.js
    │   ├── errorMiddleware.js
    │   └── validateRequest.js
    ├── models/
    │   ├── Attempt.js
    │   ├── Game.js
    │   ├── Question.js
    │   └── User.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── gameRoutes.js
    │   ├── index.js
    │   └── progressRoutes.js
    ├── services/
    │   ├── authService.js
    │   ├── gameService.js
    │   └── progressService.js
    ├── utils/
    │   ├── apiResponse.js
    │   ├── appError.js
    │   ├── asyncHandler.js
    │   └── jwt.js
    └── validators/
        ├── authValidators.js
        └── progressValidators.js
```

## 3) Complete Backend Code (file-by-file)

All backend files are fully implemented under `backend/src` and ready to run with Node.js + Express + MongoDB.

## 4) Example `.env`

Use `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/dyslexia-platform
JWT_SECRET=change-this-to-a-strong-secret
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## 5) Example API Request Payloads (Postman)

### Register
`POST /api/auth/register`

```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "password": "StrongPass123"
}
```

### Login
`POST /api/auth/login`

```json
{
  "email": "aarav@example.com",
  "password": "StrongPass123"
}
```

### Get Current Student
`GET /api/auth/me`

Header:

```txt
Authorization: Bearer <JWT_TOKEN>
```

### Get Games
`GET /api/games`

Header:

```txt
Authorization: Bearer <JWT_TOKEN>
```

### Get Questions by Game ID
`GET /api/games/:gameId/questions`

Header:

```txt
Authorization: Bearer <JWT_TOKEN>
```

### Record Attempt
`POST /api/progress/attempt`

Header:

```txt
Authorization: Bearer <JWT_TOKEN>
```

Body:

```json
{
  "gameId": "66a18c4f2a2a123456789abc",
  "score": 85,
  "timeTaken": 120
}
```

### Progress Summary
`GET /api/progress/summary`

Header:

```txt
Authorization: Bearer <JWT_TOKEN>
```
