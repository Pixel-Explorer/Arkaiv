# Arkaiv MVP

Photo sharing platform with simulated token incentives. This repository contains a Next.js frontend and an Express backend.

## Setup

1. Install dependencies in the project root:

```bash
npm install
```

2. Install backend dependencies and start the API:

```bash
cd backend
npm install
npm run dev
```

3. Copy `.env.example` to `.env` and fill in the values for Firebase and MongoDB.

4. Run the Next.js development server:

```bash
npm run dev
```

## Project Structure

- `app/` – Next.js application
- `backend/` – Express API server
- `docs/` – API documentation

## Scripts

- `npm run dev` – start Next.js
- `npm run build` – build Next.js
- `cd backend && npm run dev` – start backend API
