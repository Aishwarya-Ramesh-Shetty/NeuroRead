# Dyslexia Learning Platform (MVP)

This repository contains the MVP foundation for a Dyslexia Learning Platform.

## Current Scope

- Backend: Implemented (Node.js + Express + MongoDB)
- Frontend: Professional folder structure only (no UI code yet)

## Documentation

- Run/Install Guide: [`docs/SETUP_AND_RUN_GUIDE.md`](docs/SETUP_AND_RUN_GUIDE.md)
- Architecture Overview (detailed): [`docs/PROJECT_ARCHITECTURE.md`](docs/PROJECT_ARCHITECTURE.md)
- Architecture Diagram (Mermaid): [`docs/PROJECT_ARCHITECTURE.mmd`](docs/PROJECT_ARCHITECTURE.mmd)

## Quick Start

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Health check:

```bash
curl http://localhost:5000/health
```
