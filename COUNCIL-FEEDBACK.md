# SabiFit — Council Feedback (June 24, 2026)

**Council:** 3 perspectives — Backend Architect, Compliance Expert, Growth Marketer
**Purpose:** Saved for reference during build. Gaps and risks to address post-MVP.

---

## CRITICAL — Fix Before Launch

### Technical (Backend Architect)
1. **RLS performance** — Replace correlated subquery RLS with JWT claims. Current approach will degrade to 3-5s queries at scale.
2. **Paystack webhook idempotency** — Add `UNIQUE(paystack_ref)` constraint + `ON CONFLICT DO NOTHING`. Without it: financial data corruption.
3. **Offline strategy** — Read-only cache for MVP. No offline writes until sync engine is properly specced.
4. **Duplicate clients** — Add `UNIQUE(shop_id, phone)` constraint. Offline writes + sync = duplicate clients without it.
5. **Dashboard batching** — Batch 5 API calls into 1 endpoint. Lagos → EU Supabase = 160-630ms per call; 5 calls = unacceptable UX.
6. **Supabase region** — Use `af-south-1` Cape Town if available. Otherwise aggressive SWR caching.
7. **Generated columns on JSONB** — `measurements.fields` is a query performance trap. Add generated columns for frequently queried fields.

### Legal / Compliance (Compliance Expert)
1. **No legal entity** — Company doesn't legally exist. Register before launch.
2. **All legal docs are drafts with `[PLACEHOLDER]`** — Not enforceable. Engage a Nigerian data protection lawyer.
3. **NDPC registration** — Register with NDPC before processing any personal data. Fine: N1M or 1% of annual revenue.
4. **Data Processing Agreement** — No DPA between SabiFit and shops. Need contract for data controller / processor roles.
5. **Cookie consent** — No cookie banner or consent mechanism. Violation: N1M or 1% of annual revenue.
6. **Right to erasure** — No mechanism for users to request data deletion. Must add "Delete my account" flow.
7. **Cross-border transfers** — If any data leaves Nigeria (e.g., Vercel US), need adequacy decision or SCCs.

### Growth / Marketing (Growth Marketer)
1. **No referral system** — Word-of-mouth is the only acquisition channel. Add referral rewards.
2. **No onboarding flow** — New users land in dashboard with no guidance. Need interactive walkthrough.
3. **No product updates** — No changelog or release notes. Users won't know new features.
4. **No SMS delivery proof** — Using mock OTP. Real Nigerian SMS needs delivery receipts.
5. **No WhatsApp channel** — WhatsApp is Nigeria's dominant messaging app. Need Termii WhatsApp integration.

---

## HIGH PRIORITY — MVP

### Technical
1. **Search** — No client search. Add full-text search on name + phone.
2. **Pagination** — No pagination on lists. Will break at 100+ clients.
3. **Error boundaries** — No error UI. App crashes silently on errors.
4. **Loading states** — No loading spinners. Users think app is frozen.
5. **Image upload** — Photo upload not implemented. Need Supabase Storage + image compression.

6. **Email notifications** — No email delivery. Need Resend or SendGrid.

### Legal / Compliance
1. **Privacy Policy** — Publish final privacy policy. Must include: data collected, purpose, retention, rights.
2. **Terms of Service** — Publish final ToS. Must include: liability, dispute resolution, termination.
3. **Cookie Policy** — Publish cookie policy. Must include: categories, purposes, consent mechanism.
4. **NDPC registration** — Complete NDPC registration.

### Growth / Marketing
1. **Landing page** — No public landing page. Need sabifit.app (marketing site).
2. **Demo video** — No product demo. Add 2-minute demo video.
3. **Pricing page** — No pricing information. Add pricing tiers.
4. **Contact form** — No way to contact support. Add contact form.


---

## MEDIUM PRIORITY — Post-MVP (Q3 2026)


### Technical
1. **Multi-staff accounts** — Only owner access. Add role-based permissions.
2. **Audit logs** — No activity tracking. Add audit log table.
3. **Webhooks** — No webhook system. Add for third-party integrations.
4. **API** — No public API. Add REST/GraphQL API for partners.
5. **Mobile app** — PWA only. Consider React Native for better mobile experience.
6. **Offline mode** — No offline support. Add PWA offline caching + sync.
7. **Two-factor auth** — No 2FA. Add TOTP-based 2FA.


### Legal / Compliance
1. **Data export** — No way for users to export their data. Add JSON/CSV export.
2. **Data retention** — No retention policy. Add automated deletion after inactivity.
3. **Breach notification** — No breach response plan. Add 72-hour NDPC notification.
4. **DPA for enterprise** — No enterprise DPA. Add for larger clients.
5. **GDPR compliance** — No GDPR-specific features. Add for EU expansion.


### Growth / Marketing
1. **Email marketing** — No email campaigns. Add Resend or SendGrid.
2. **In-app messaging** — No notifications. Add in-app messaging.
3. **Analytics dashboard** — No usage analytics. Add dashboards.
4. **A/B testing** — No experimentation. Add feature flags.
5. **Integrations** — No integrations. Add QuickBooks, Zapier, etc.
6. **White-label** — No white-label option. Add for enterprises.

---

## NICE TO HAVE — Later

### Technical
1. **AI measurements** — Auto-extract measurements from photos. Computer vision research needed.
2. **Size recommendations** — ML-based size recommendations. Requires training data.
3. **Style suggestions** — AI-powered style suggestions. Requires fashion dataset.
4. **AR try-on** — Augmented reality try-on. Requires 3D scanning.
5. **Voice input** — Voice measurement entry. Requires speech recognition.
6. **Multi-language** — English only. Add Hausa, Yoruba, Igbo.


### Legal / Compliance
1. **HIPAA** — No US healthcare compliance. Add if entering US market.
2. **POPIA** — No South African compliance. Add if entering SA market.


### Growth / Marketing
1. **Marketplace** — No fabric/marketplace. Add marketplace for fabrics.
2. **Tailor directory** — No tailor directory. Add discovery marketplace.
3. **Reviews** — No reviews/ratings. Add review system.
4. **Community** — No community features. Add forums, groups.
5. **Blog** — No content marketing. Add blog.
6. **Partnerships** — No bank/fintech partnerships. Add financing.
