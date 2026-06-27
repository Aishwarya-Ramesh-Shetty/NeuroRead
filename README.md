# 🧠 NeuroRead - Dyslexia Learning Platform

> An interactive MERN stack web application that empowers children with dyslexia through gamified learning, personalized learning paths, and pronunciation-assisted educational activities.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge\&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge\&logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge\&logo=tailwind-css)

---

## 🌐 Live Demo

**Frontend:** https://neuro-read-frontend.vercel.app

> *(Add your Render backend URL here once deployed.)*

---

## 📖 Overview

NeuroRead is a web-based learning platform specially designed to support children with dyslexia. It combines educational games, personalized learning, pronunciation support, and progress tracking to create an engaging and accessible learning experience.

The platform enables students to improve reading, spelling, vocabulary, and pronunciation through interactive activities while allowing them to progress at their own pace.

---

## ✨ Features

### 🔐 Authentication

* Secure student registration and login
* JWT-based authentication
* Protected routes

### 🎮 Educational Games

* Letter Recognition
* Alphabet Matching
* Picture Based MCQ
* Match the Column
* Word Builder
* Jumbled Words
* Sound Identification
* Sentence Formation
* Fill in the Blanks
* Spelling Correction

### 🔊 Pronunciation Assistance

* Click any letter to hear its pronunciation
* Word pronunciation support using audio
* Audio-assisted learning for better retention

### 📚 Personalized Learning

* Level-based learning path
* Sequential game unlocking
* Structured progression from beginner to advanced

### 📊 Progress Tracking

* Track completed games
* Monitor scores and attempts
* View learning progress dashboard

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router
* Context API

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB
* Mongoose ODM

### Authentication

* JWT
* bcrypt

---

## 📂 Project Structure

```text
NeuroRead/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
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
│   └── server.js
```

---

## 🗄️ Database Design

The application uses MongoDB with the following collections:

* Users
* Games
* Questions
* Attempts
* User Progress
* Pronunciations

---

## 🔄 Application Workflow

1. Student registers or logs in.
2. JWT is generated and stored for authenticated access.
3. Students can explore games from the Dashboard or follow the Personalized Learning path.
4. Each game fetches questions dynamically from the backend.
5. Clicking on letters or words plays pronunciation audio.
6. Game attempts are stored in MongoDB.
7. Progress is updated after every completed game.
8. Dashboard displays scores, attempts, and completed levels.

---

## 🚀 Running Locally

### Clone the repository

```bash
git clone <repository-url>
cd NeuroRead
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔮 Future Enhancements

* AI-powered adaptive learning
* Speech recognition
* Teacher dashboard
* Parent portal
* Achievement badges and streaks
* Multi-language support
* Mobile application

---

## 👩‍💻 Author

**Aishwarya Shetty**

If you found this project useful, consider giving it a ⭐ on GitHub!
