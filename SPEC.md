# SabiFit — Technical Specification

**Version:** 1.0
**Last Updated:** June 24, 2026

---

## 1. Overview

SabiFit is a SaaS platform for Nigerian fashion designers to manage clients, capture measurements, track orders, and generate invoices.


## 2. Tech Stack

- **Frontend:** Next.js 16 (App Router, TypeScript)
- **Database:** Supabase (PostgreSQL, Auth, RLS, Storage)
- **Styling:** Tailwind CSS v4
- **Forms:** React Hook Form + Zod
- **Payments:** Paystack (future)
- **SMS/WhatsApp:** Termii (future)
- **Hosting:** Vercel

## 3. Database Schema

### Tables

- `shops` — Fashion design houses
- `users` — Shop staff (extends auth.users)
- `clients` — Customers
- `measurements` — Measurement records
- `orders` — Orders
- `invoices` — Invoices
- `measurement_links` — Self-service links

### RLS Policies

- All tables protected by RLS
- Shop-scoped access via `users.shop_id`
- Public read for measurement links via token

## 4. API Routes

### Auth

- `POST /auth/login` — Email/password login
- `POST /auth/signup` — Phone OTP signup
- `POST /auth/otp` — Verify OTP
- `POST /auth/shop-setup` — Create first shop

### Clients

- `GET /clients` — List clients
- `POST /clients` — Create client
- `GET /clients/[id]` — Get client
- `PATCH /clients/[id]` — Update client
- `DELETE /clients/[id]` — Archive client

### Measurements

- `GET /measurements` — List measurements
- `POST /measurements` — Create measurement
- `GET /measurements/[id]` — Get measurement
- `PATCH /measurements/[id]` — Update measurement

### Orders

- `GET /orders` — List orders
- `POST /orders` — Create order
- `GET /orders/[id]` — Get order
- `PATCH /orders/[id]` — Update order

### Invoices

- `GET /invoices` — List invoices
- `POST /invoices` — Create invoice
- `GET /invoices/[id]` — Get invoice
- `POST /invoices/[id]/pay` — Initialize payment

### Measurement Links

- `POST /measurement-links` — Create link
- `GET /m/[token]` — Public form
- `POST /m/[token]` — Submit measurement

## 5. Security

- All routes protected by Supabase Auth
- RLS on all data tables
- Service role key never exposed to client
- Input validation via Zod
- CSRF protection via Next.js

## 6. Performance

- Target: < 200ms API response
- Supabase region: eu (default) or af-south-1 (when available)
- SWR for client-side caching
- Optimistic updates

## 7. Compliance

- NDPR 2019 compliant
- NDPA 2023 registration (planned)
- Cookie policy (draft)
- Privacy policy (draft)
- Terms of service (draft)
