# ORBIT — Explore the Universe
### Cinematic Solar System Exploration & Personalized Astronomy Observatory

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Community%20%2F%20Atlas-brightgreen.svg)](https://www.mongodb.com/)
[![NASA API](https://img.shields.io/badge/Integration-NASA%20Images%20API-orange.svg)](https://images.nasa.gov/)
[![Assessment](https://img.shields.io/badge/Submission-Continuous%20Assessment%20(CA)-purple.svg)](#)

---

## 1. Project Overview

**ORBIT** is a full-stack space exploration web application built for a college Continuous Assessment (CA) project. The platform provides an educational, cinematic voyage through our Solar System—allowing stargazers and students to explore detailed scientific telemetry for the eight recognized planets, query real NASA spacecraft photography in real time, test their astronomical understanding through an interactive 10-question cosmic quiz, and archive their favorite planetary bodies in a private, authenticated **Observatory** backed by MongoDB.

### Key Highlights
- **Cinematic Landing Hero**: Dynamic planetary visualization with orbital rings, orbiting celestial bodies, atmospheric glow, and layered starfields executed with performant CSS radial gradients and transforms.
- **Genuine MongoDB Persistence**: Curated 8-planet catalog with an idempotent seed script, user account storage with `bcryptjs` password hashing, private saved discoveries, and server-verified quiz attempts.
- **Official NASA Images Library API Proxy**: Backend-proxied search with query validation, timeout guards, and in-memory caching (`node-cache`) to stream authentic Mars rover, nebula, and galaxy photography without exposing external API risks.
- **Interactive Cosmic Quiz**: 10 Solar System multiple-choice questions with server-side score calculation, instant feedback, progress tracking, and persistence to the user's Observatory.
- **My Observatory Dashboard**: Private mission control displaying personalized explorer telemetry, archived worlds with live deletion controls, and historical assessment logs.

---

## 2. Technology Stack

- **Frontend**: React.js (v18), Vite 6, React Router DOM (v6), Lucide React (vector iconography).
- **Styling**: Vanilla CSS Design System with custom design tokens, responsive CSS Grid, glassmorphism (`backdrop-filter`), and `prefers-reduced-motion` compliance.
- **Backend**: Node.js & Express.js (ES Modules).
- **Database**: MongoDB (local Community Server or MongoDB Atlas) using Mongoose (v8) for schema validation and indexing.
- **Security & Auth**: `bcryptjs` (salt rounds = 10), JSON Web Tokens (JWT) signed in `HttpOnly` cookies, rate limiting (`express-rate-limit`), and input sanitization.
- **External Integration**: NASA Images and Video Library API (`https://images-api.nasa.gov/search`).

---

## 3. Prerequisites

Before running ORBIT, ensure you have the following installed on your machine:
1. **Node.js**: `v18.x` or higher (`node -v`)
2. **NPM**: `v9.x` or higher (`npm -v`)
3. **MongoDB**: Local MongoDB Community Edition (`brew services start mongodb-community` on macOS or standard Windows service) **OR** a free [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI.
4. **MongoDB Compass** (Optional GUI): Recommended for evaluating and inspecting database collections visually.

---

## 4. Environment Variables Setup

A template configuration is provided in `.env.example`. 

Create a `.env` file in the `server/` directory:

```bash
# File: server/.env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/orbit_db
JWT_SECRET=orbit_super_secret_jwt_key_evaluation_2026_cosmic_space_ca
CLIENT_URL=http://localhost:5173
```

> **Note on MongoDB Compass**: The application connects to the MongoDB database engine at `mongodb://127.0.0.1:27017/orbit_db`. You can open MongoDB Compass and connect to `mongodb://127.0.0.1:27017` to inspect all stored collections and documents in real time.

---

## 5. Quick Start Instructions (Local Execution)

Run the application using two terminal windows:

### Terminal 1: Backend Server & Database Seed
```bash
# 1. Navigate to the project root and install server dependencies
cd server
npm install

# 2. Seed the curated eight planets catalog into MongoDB (Idempotent)
npm run seed

# 3. Start the Express API server (starts on http://localhost:5001)
npm run dev
```

### Terminal 2: Frontend Client (Vite Dev Server)
```bash
# 1. From the project root, navigate to the client directory
cd client
npm install

# 2. Start the Vite development server (starts on http://localhost:5173)
npm run dev
```

Open your browser and navigate to **`http://localhost:5173`**.

---

## 6. Inspecting the Database in MongoDB Compass

To inspect the application data during evaluation:
1. Open **MongoDB Compass**.
2. In the "New Connection" field, enter:
   ```
   mongodb://127.0.0.1:27017
   ```
3. Click **Connect**.
4. In the left database navigation panel, select **`orbit_db`**.
5. You will see the following four collections:
   - **`planets`**: Contains the 8 recognized planets populated by `npm run seed`.
   - **`users`**: Contains registered explorer profiles with salted `passwordHash` (never stored in plaintext).
   - **`saveddiscoveries`**: Stores saved planets linked by `userId` and `planetSlug` (enforces compound uniqueness).
   - **`quizattempts`**: Stores completed quiz results with calculated scores, percentages, and completion timestamps.

---

## 7. Application Routes & Navigation

| Route | Page | Purpose & Features |
|---|---|---|
| `/` | **Home** | Cinematic hero, planetary showcase, feature pillars, telemetry counter, mission CTAs. |
| `/explore` | **Explore** | 8 recognized planets, search bar, category filters (*Terrestrial*, *Gas Giant*, *Ice Giant*), save buttons. |
| `/explore/:slug` | **Planet Detail** | Telemetry grid (diameter, orbit, rotation, gravity, temperature), facts, atmosphere, NASA deep link, next/previous navigation. |
| `/gallery` | **Space Gallery** | Real NASA Images Library API search, suggestion chips, modal preview, metadata inspector. |
| `/quiz` | **Cosmic Quiz** | 10 multiple-choice astronomy questions, server-verified scoring, explanation feedback, Observatory save. |
| `/login` | **Sign In** | Email/password authentication, JWT cookie issuance, auto-reclaims pending quiz score. |
| `/register` | **Register** | Creates new explorer account with password confirmation and `bcryptjs` hashing. |
| `/observatory` | **My Observatory** | *Protected*: Explorer stats, saved planets with deletion controls, quiz assessment history. |
| `/about` | **About** | Educational mission, technology architecture overview, CA submission metadata. |
| `*` | **404 Not Found** | Space-themed lost in space screen with return to mission control action. |

---

## 8. Backend REST API Summary

### System Health
- `GET /api/health` — Returns truthful server uptime, timestamp, and active MongoDB connection status.

### Authentication
- `POST /api/auth/register` — Validates inputs, hashes password, returns user object & sets HttpOnly cookie.
- `POST /api/auth/login` — Verifies credentials with bcrypt, returns user object & sets HttpOnly cookie.
- `POST /api/auth/logout` — Clears authentication cookie.
- `GET /api/auth/me` — Protected: Returns currently authenticated user session.

### Planet Catalog
- `GET /api/planets` — Retrieves all 8 planets sorted by orbital order from the Sun.
- `GET /api/planets/:slug` — Retrieves single planet details along with adjacent navigation slugs.

### Saved Discoveries (Observatory)
- `GET /api/saved-discoveries` — Protected: Retrieves current user's saved planets populated with planet details.
- `POST /api/saved-discoveries` — Protected: Adds a planet to user's saved collection (unique constraint).
- `DELETE /api/saved-discoveries/:id` — Protected: Deletes a saved planet by ID or slug for the current user.

### Cosmic Quiz
- `GET /api/quiz/questions` — Returns the 10 quiz questions (excluding answer keys).
- `POST /api/quiz/evaluate` — Evaluates submitted answers and returns score breakdown with explanations.
- `POST /api/quiz-attempts` — Protected: Evaluates score server-side and records attempt in MongoDB.
- `GET /api/quiz-attempts` — Protected: Retrieves user's quiz attempt history and highest score.

### NASA Imagery Proxy
- `GET /api/nasa/search?q=:query` — Queries the official NASA Images API (`images-api.nasa.gov`), validates parameters, limits records to 12, caches in-memory, and provides fault tolerance.

---

## 9. Verification & Automated Testing Suite

The repository includes an automated integration test script that validates all 11 core backend endpoints:

```bash
# Run the automated verification suite
node server/src/scripts/testEndpoints.js
```

### Verified Test Outputs
```
--- STARTING ORBIT API VERIFICATION SUITE ---
1. Testing GET /api/health...
   ✓ Health check passed. DB status: connected
2. Testing GET /api/planets...
   ✓ Retrieved 8 planets successfully.
3. Testing GET /api/planets/mars...
   ✓ Planet detail for Mars verified. Adjacent: Earth <- Mars -> Jupiter
4. Testing POST /api/auth/register...
   ✓ Registered user: Commander Nova test_explorer@orbit.edu
5. Testing GET /api/auth/me...
   ✓ Authenticated profile verified: Commander Nova
6. Testing POST /api/saved-discoveries...
   ✓ Saved planet to Observatory: Jupiter
7. Testing GET /api/saved-discoveries...
   ✓ Retrieved saved discoveries. Planet: Jupiter
8. Testing POST /api/quiz-attempts...
   ✓ Server verified quiz score: 3/10 (30%)
9. Testing GET /api/quiz-attempts...
   ✓ Quiz history verified. Best score: 3
10. Testing DELETE /api/saved-discoveries/jupiter...
   ✓ Removed saved planet jupiter successfully.
11. Testing GET /api/nasa/search?q=mars...
   ✓ NASA Image Proxy returned 12 items. Sample title: "Mars Celebration"

========================================
ALL 11 BACKEND API VERIFICATION TESTS PASSED!
========================================
```

---

## 10. Data & Asset Attribution

- **Planetary Science Telemetry**: Curated from [NASA Science Solar System Exploration](https://science.nasa.gov/solar-system/planets/).
- **Deep Space Imagery**: Live queries powered by the [NASA Images and Video Library API](https://images.nasa.gov/).
- **Typography**: Space Grotesk, Plus Jakarta Sans, and JetBrains Mono via Google Fonts.
- **Icons**: Lucide React.

---

## 11. Author & Academic Submission

- **Student / Developer**: samairakale3031-lab
- **GitHub Profile**: [samairakale3031-lab](https://github.com/samairakale3031-lab)
- **Target Repository**: [25070521230-CA-3](https://github.com/samairakale3031-lab/25070521230-CA-3)
- **Course**: Continuous Assessment (CA) — Full-Stack Web Application Evaluation
