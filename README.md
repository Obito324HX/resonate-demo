# Resonate

Full-stack e-commerce demo — Next.js storefront, Express/Prisma REST API, PostgreSQL, and a real Stripe integration handling checkout in test mode.

**Live demo:** https://resonate-demo-six.vercel.app
**Admin panel:** `/admin/login`

## Stack

- **Frontend:** Next.js 14, Tailwind CSS
- **Backend:** Express, Prisma ORM
- **Database:** PostgreSQL (Neon)
- **Payments:** Stripe Checkout (test mode)
- **Hosting:** Vercel (frontend), Render (backend)

## Features

- Product catalog with category filtering, search, and sort
- Cart and checkout via Stripe's hosted Checkout page
- Order lifecycle tracking (Pending → Paid → Shipped) verifiable through the admin panel
- JWT-protected admin panel for managing products and orders
- Customer order tracking by order ID + email, no account required
- Low-stock indicators driven by live inventory data

## Project structure

```
resonate/
├── backend/     Express API + Prisma
└── frontend/    Next.js storefront + admin
```

## Local development

```bash
# Backend
cd backend
npm install
npx prisma migrate dev
npm run seed
npm run dev          # http://localhost:4000

# Frontend
cd frontend
npm install
npm run dev           # http://localhost:3000
```

### Environment variables

**backend/.env**

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing admin auth tokens |
| `STRIPE_SECRET_KEY` | Stripe test-mode secret key |
| `FRONTEND_URL` | Used to build Stripe redirect URLs |

**frontend/.env.local**

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

## Notes

- Checkout runs entirely in Stripe's test mode — no real payment is ever processed. Test card: `4242 4242 4242 4242`, any future expiry, any CVC.
- Render's free tier spins down after inactivity; first request after idle may take 30–60s.

## Author

Built by [Cletus Bwalya](https://obito324hx.github.io/Portfolio/).
