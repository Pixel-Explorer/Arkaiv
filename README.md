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

3. Copy `.env.example` to `.env` and fill in credentials for Firebase, MongoDB, and Supabase. `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` must be provided for the app to build and authenticate users. Set both `API_URL` and `NEXT_PUBLIC_API_URL` to the backend URL.

4. Run the Next.js development server:

```bash
npm run dev
```

5. **Before running tests**, ensure dependencies are installed in both the
   project root and the `backend/` directory:

```bash
npm install
cd backend && npm install
```

## Project Structure

- `app/` – Next.js application
- `backend/` – Express API server
- `docs/` – API documentation

### Authentication

Image uploads require a valid Supabase session token. Include an
`Authorization: Bearer <token>` header when calling `/upload-image`.

## Scripts

- `npm run dev` – start Next.js
- `npm run build` – build Next.js
- `cd backend && npm run dev` – start backend API
