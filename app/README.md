# SabiFit App

> Nigerian fashion designers' best friend. Digitize measurements, manage clients, track orders.

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Database:** Supabase (Postgres + Auth + RLS)
- **Styling:** Tailwind CSS v4 (brand: Indigo #1E2A78 + Clay #C76851)
- **Forms:** React Hook Form + Zod
- **Payments:** Paystack (future)
- **SMS/OTP:** Termii (future)

## Project Structure

```
app/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/          # Email + password sign in
│   │   │   ├── signup/         # Phone OTP or email signup
│   │   │   ├── otp/            # OTP verification page
│   │   │   └── shop-setup/     # First-time shop creation
│   │   ├── dashboard/          # Main app dashboard
│   │   ├── globals.css          # Tailwind + brand CSS variables
│   │   ├── layout.tsx           # Root layout with Poppins font
│   │   └── page.tsx             # Root → redirects to login or dashboard
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts        # Browser Supabase client
│   │   │   └── server.ts        # Server-side Supabase client
│   │   └── utils.ts            # Helpers (cn, formatNaira, slugify)
│   ├── middleware.ts            # Supabase session refresh
│   └── types/
│       └── supabase.ts         # DB types + garment labels
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Run this in Supabase SQL Editor
├── .env.local.example           # Copy → .env.local and fill in
└── package.json
```

## Setup

### 1. Supabase Project

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/migrations/001_initial_schema.sql`
3. Go to **Authentication → Providers** and enable Phone (SMS) auth
4. Copy your `Project URL`, `anon key`, and `service_role key`
### 2. Environment Variables

```bash
cp .env.local.example .env.local
# Fill in:
# NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
# SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
### 4. Auth Providers (for production)

- **Phone/OTP:** Supabase built-in SMS (Firebase under the hood). Configure in Supabase Dashboard → Authentication → Phone
- **Email/Password:** Supabase built-in, no extra config
- **Termii (real Nigerian SMS):** Replace Supabase SMS with Termii API in the auth routes

## Features (Build Order)

1. ✅ Auth (phone OTP + email/password) — done
2. 🔲 Shop setup on first login — done
3. 🔲 Client management (CRUD, search, archive)
4. 🔲 Measurement capture (garment templates, photo upload)
5. 🔲 Orders (create, track, assign staff)
6. 🔲 Invoices (auto-create, Paystack payment links)
7. 🔲 Cloth yardage calculator (standalone: `/calculator/yardage-calculator.html`)
8. 🔲 Self-service measurement link (diaspora clients)
9. 🔲 WhatsApp notifications (Termii)
10. 🔲 Multi-staff / shop mode

## Garment Types Supported

Agbada, Kaftan, Buba + Sokoto, Senator, Native Shirt + Trouser, Dashiki, Babban Riga, Kperti, Blouse, Wrapper Set, Iro + Buba, Kaba, Gown, Kaba + Wrapper, Maternity, Aso-oke / Gele, Children's

## Brand

- **Primary:** Indigo `#1E2A78`
- **Accent:** Clay `#C76851`
- **Background:** `#F7F8FC`
- **Font:** Poppins

## TODO

- [ ] Supabase project setup + env vars
- [ ] Deploy to Vercel
- [ ] Termii OTP integration (replace mock)
- [ ] Paystack payment link generation
- [ ] Real cloth calculator page in app
- [ ] Client management pages
- [ ] Measurement capture pages
- [ ] Order management pages
- [ ] Invoice pages
- [ ] Self-service measurement link pages
- [ ] WhatsApp/SMS notifications
- [ ] Shop settings + staff management
