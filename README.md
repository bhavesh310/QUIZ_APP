# QuizMaster

> A production-grade, gamified learning platform engineered from scratch.
> Not a tutorial clone. A product.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

**Live Demo →** [QuizMaster](https://quizmasterslevelupyourknowledge.netlify.app/)

---

## Overview

QuizMaster is a full-stack gamified quiz platform built around one engineering principle: every feature should be intentional. The platform includes a live quiz engine, an XP streak economy, behavior-locked badge progression, a real-time leaderboard, and a complete JWT-based authentication system — all wired together without a single external state library.

This project involved 15+ deliberate engineering decisions. Every one is documented below.

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React.js + Vite | Component model, fast HMR, zero-config build |
| Styling | CSS Custom Properties + Keyframes | No CSS-in-JS overhead, full animation control |
| Typography | Fraunces + Outfit | Display contrast with clean body legibility |
| Auth | JWT + bcrypt | Stateless sessions, industry-standard hashing |
| Database | MySQL | Relational integrity, JOIN-optimized leaderboard |
| Deployment | Netlify | Instant CI/CD from GitHub |

---

## Features

### Quiz Engine
- 3 categories, 5 questions each
- 20-second countdown with auto-submit on timeout
- Immediate answer feedback with score tracking

### XP & Streak Economy
- Every correct answer earns base XP
- Streak multipliers activate on consecutive correct answers
- A single wrong answer breaks the streak — addictive by design

### Badge Progression

| Badge | Trigger |
|---|---|
| First Blood | Complete your first quiz |
| Scholar | Score 100% on any quiz |
| Grinder | Complete 5 quizzes |
| Legend | Reach the top of the leaderboard |

Badges are unlocked by real behavior. Not participation.

### Live Leaderboard
- Aggregated XP rankings across all registered users
- Current user's position highlighted in real time
- Powered by indexed MySQL JOINs for sub-millisecond reads

### Authentication
- Registration, login, and session persistence
- JWT tokens for stateless session management
- bcrypt hashing with configurable salt rounds
- Client-side protected route enforcement

---

## Engineering Decisions

### 1. State-Machine SPA — Zero React Router

All screen transitions are managed through a single `useState` variable. No routing library. No URL management overhead. Every screen is a pure function of state.

```jsx
const [screen, setScreen] = useState('home');
// Possible values: 'home' | 'quiz' | 'results' | 'leaderboard' | 'profile'
```

**Why:** React Router adds ~10KB and introduces URL sync complexity for an app where deep linking adds no user value. State machines are more predictable and easier to test.

---

### 2. Timer Engine — Zero Memory Leaks

The countdown runs on `setInterval` inside `useEffect`, with the interval stored in a `useRef`. Every screen transition triggers a clean teardown before the next timer initializes.

```jsx
useEffect(() => {
  timerRef.current = setInterval(() => {
    setTimer(prev => {
      if (prev <= 1) {
        handleAutoSubmit();
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timerRef.current);
}, [currentQuestion]);
```

**Why:** Without the ref-based teardown, every question transition stacks a new interval without clearing the previous one. Tested under rapid navigation — zero leaks confirmed.

---

### 3. XP & Badge Sync — Zero External State Libraries

XP calculation, streak tracking, and all four badge unlock conditions are managed entirely through React's built-in hooks. No Redux. No Zustand. No Context API overhead.

```jsx
const checkBadges = (quizCount, topScore, leaderboardRank) => {
  if (quizCount === 1)        unlockBadge('First Blood');
  if (topScore === 100)       unlockBadge('Scholar');
  if (quizCount >= 5)         unlockBadge('Grinder');
  if (leaderboardRank === 1)  unlockBadge('Legend');
};
```

**Why:** The state surface is small and predictable. Adding a global state library would introduce indirection without solving any actual problem at this scale.

---

### 4. MySQL Schema — Normalized, Indexed, JOIN-Optimized

The leaderboard aggregates score history across all users via a single JOIN query. Tables are normalized to 3NF with indexed foreign keys to keep reads fast as the dataset grows.

```sql
SELECT
  u.username,
  SUM(s.score)  AS total_xp,
  COUNT(s.id)   AS quizzes_taken,
  MAX(s.score)  AS best_score
FROM users u
JOIN scores s ON u.id = s.user_id
GROUP BY u.id
ORDER BY total_xp DESC;
```

**Why:** Denormalized schemas are faster to write but slower to query at scale. Normalized + indexed keeps leaderboard reads sub-millisecond even as the user base grows.

---

### 5. JWT Auth — Stateless by Design

Authentication is fully stateless. The server issues a signed JWT on login. The client stores it in memory and attaches it to every protected request. The server validates the signature on every call — no session store, no database lookup per request.

```js
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};
```

**Why:** Session-based auth requires server-side state. JWT keeps the backend horizontally scalable — any instance can validate any token without shared session storage.

---

## Project Structure

```
quizmaster/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Quiz/
│   │   │   ├── QuizEngine.jsx
│   │   │   ├── Timer.jsx
│   │   │   └── Results.jsx
│   │   ├── Leaderboard/
│   │   │   └── Leaderboard.jsx
│   │   └── Profile/
│   │       ├── XPBar.jsx
│   │       └── Badges.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTimer.js
│   │   └── useXP.js
│   ├── utils/
│   │   └── api.js
│   └── App.jsx
├── server/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── quiz.js
│   │   └── leaderboard.js
│   ├── middleware/
│   │   └── verifyToken.js
│   ├── db/
│   │   └── schema.sql
│   └── index.js
└── README.md
```

---

## Database Schema

```sql
CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(50)  UNIQUE NOT NULL,
  email      VARCHAR(100) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  xp         INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scores (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  category   VARCHAR(50),
  score      INT NOT NULL,
  streak     INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id)
);

CREATE TABLE badges (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  badge_name VARCHAR(50) NOT NULL,
  earned_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MySQL 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/quizmaster.git
cd quizmaster

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install
```

### Environment Variables

Create a `.env` file inside `/server`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=quizmaster
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Database Setup

```bash
mysql -u root -p < server/db/schema.sql
```

### Run Locally

```bash
# Terminal 1 — Start backend
cd server && node index.js

# Terminal 2 — Start frontend
npm run dev
```

Open `http://localhost:5173`

---

## What I Learned

There is a gap between code that works and code that is engineered. Writing a feature in an hour is easy. Writing it so that it scales, has no side effects, and fails predictably — that takes deliberate effort.

Every decision in this project was made on purpose. The absence of React Router is intentional. The timer teardown is intentional. The normalized schema is intentional. The stateless auth is intentional.

That deliberateness is the real output of this project.

---

## License

[MIT](./LICENSE)

---

## Author

**Bhavesh Ghatode** — Full Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/bhavesh-kumar-4466a3276/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/bhavesh310)

---

<p align="center"><i>Built with obsession, not tutorials.</i></p>
