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

## 6. Set up Stripe (test mode)

Checkout now redirects to a real Stripe payment page, running entirely in Stripe's
free test mode — no real card or money is ever involved.

1. Create a free account at https://dashboard.stripe.com/register
2. Make sure you're in **Test mode** (toggle top-right of the dashboard)
3. Go to https://dashboard.stripe.com/test/apikeys and copy the **Secret key** (starts with `sk_test_`)
4. Add it to your backend `.env` locally:
   ```
   STRIPE_SECRET_KEY="sk_test_..."
   FRONTEND_URL="http://localhost:3000"
   ```
5. Add the same two variables to your **Render** service's environment variables —
   for `FRONTEND_URL`, use your real deployed Vercel URL (e.g.
   `https://resonate-demo-six.vercel.app`), not localhost.
6. Since the `Order` model changed (added `stripeSessionId`), run a new migration:
   ```bash
   cd backend
   npx prisma migrate dev --name add_stripe_session
   ```
   Then on Render, in the Shell tab: `npx prisma migrate deploy`

**Test card for checkout:** `4242 4242 4242 4242`, any future expiry date, any
3-digit CVC, any postal code. Stripe's test mode has other card numbers for
simulating declines, 3D Secure, etc. — see https://stripe.com/docs/testing.

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
