# Resonate — Full-Stack E-Commerce Demo

A demo audio-gear store built to showcase full-stack ability: Next.js storefront,
Express + Prisma REST API, PostgreSQL database, JWT-protected admin panel.

```
resonate/
├── backend/     Express API + Prisma (deploy to Render)
├── frontend/    Next.js storefront + admin (deploy to Vercel)
```

## 1. Local setup

### Prerequisites
- Node.js 18+
- A free Neon Postgres database: https://neon.tech (create a project, copy the connection string)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: paste your Neon DATABASE_URL, set a random JWT_SECRET
npx prisma migrate dev --name init
npm run seed
npm run dev
```

The API will run at `http://localhost:4000`. Test it: `curl http://localhost:4000`.

### Frontend

In a new terminal:

```bash
cd frontend
npm install
cp .env.local.example .env.local
# .env.local already points to http://localhost:4000/api, which matches the backend above
npm run dev
```

Visit `http://localhost:3000` for the storefront and `http://localhost:3000/admin/login`
for the admin panel (default login: `admin@resonate.dev` / `changeme123` — **change this
password before showing it to any client**).

## 2. Push to GitHub

```bash
cd resonate
git init
git add .
git commit -m "Initial commit: Resonate full-stack e-commerce demo"
git branch -M main
git remote add origin https://github.com/Obito324HX/resonate-demo.git
git push -u origin main
```

(Create the empty `resonate-demo` repo on GitHub first, or use `gh repo create` if you
have the GitHub CLI installed.)

Consider splitting into two repos (`resonate-backend`, `resonate-frontend`) if you want
cleaner separate deploys — either works with Render/Vercel.

## 3. Deploy the database — Neon

You likely already have this from local setup. Just make sure the same
`DATABASE_URL` gets used in Render's environment variables (step 4).

## 4. Deploy the backend — Render

1. New "Web Service" on Render, connect your GitHub repo, set root directory to `backend`
2. Build command: `npm install && npx prisma generate`
3. Start command: `npm start`
4. Environment variables: `DATABASE_URL` (from Neon), `JWT_SECRET` (random string)
5. After first deploy, open the Render shell and run:
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```
6. Note your live backend URL, e.g. `https://resonate-backend.onrender.com`

## 5. Deploy the frontend — Vercel

1. New project on Vercel, import your GitHub repo, set root directory to `frontend`
2. Environment variable: `NEXT_PUBLIC_API_URL=https://resonate-backend.onrender.com/api`
3. Deploy

Your storefront will be live at something like `https://resonate-demo.vercel.app`.

## Notes for portfolio use

- Checkout is a **mock checkout** — no real payment processor is wired in. It still writes
  real orders to the database and decrements real stock, which is what actually
  demonstrates backend logic to a client.
- Change the admin password (`changeme123`) via Neon's SQL editor or by adding a
  "change password" endpoint before sharing the admin URL publicly.
- Product images use placeholder photos (picsum.photos). Swap `imageUrl` values in
  `backend/prisma/seed.js` for real product photos if you want a more polished look —
  host them anywhere (Cloudinary, GitHub, etc.) and use the direct image URL.
- Render's free tier spins down after inactivity — the first request after idle time
  can take 30-60 seconds. Worth mentioning to clients viewing the live demo, or
  upgrading to a paid tier before a client call.
