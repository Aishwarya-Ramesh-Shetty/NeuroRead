# Dyslexia Learning Platform

A full-stack MERN application designed to support children with Dyslexia through interactive and gamified learning. The platform helps students improve reading, spelling, pronunciation, and word recognition using educational games, personalized learning paths, and progress tracking.

---

## Features

### Authentication
- Secure student registration and login using JWT
- Protected routes for authorized access

### Educational Games
- Letter Recognition
- Alphabet Matching
- Picture Based MCQ
- Match the Column
- Word Builder
- Jumbled Words
- Sound Identification
- Sentence Formation
- Fill in the Blanks
- Spelling Correction

### Pronunciation System
- Click on individual letters to hear pronunciation
- Full word pronunciation support using audio playback

### Personalized Learning
- Level-based game unlocking system
- Students must complete one level before moving to the next

### Progress Tracking
- Tracks attempts, scores, time taken, and completed levels
- Dashboard for monitoring student performance

---

## Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- React Router
- Context API

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose ODM

### Authentication
- JWT (JSON Web Token)
- bcrypt password hashing

---

## Project Structure

```bash
Dyslexia-Learning-Platform/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── routes/
│   │   └── assets/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── app.js
│   └── server.js
│
└── README.md
