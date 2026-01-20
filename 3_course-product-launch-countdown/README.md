# Product Launch Admin & Editor

A complete course/product launch platform with countdown timer, waitlist management, email automation, Stripe checkout integration, and an admin dashboard to manage your entire launch campaign.

<img width="1499" height="908" alt="image" src="https://github.com/user-attachments/assets/d2d5ec60-72f9-4fdb-bc27-bce388beca99" />

---

## ✨ Features

- **Landing Page**
  - Countdown timer to launch date
  - Hero section with product messaging
  - Features, testimonials, pricing, and FAQ sections
  - Responsive design with light/dark theme support
- **Waitlist Management**
  - Email capture with waitlist form
  - Referral tracking system
  - Email sequence automation (5-email launch sequence)
  - Bulk email preview and management
- **Payment Integration**
  - Stripe checkout integration
  - Early bird pricing with limited spots
  - Purchase tracking and confirmation
- **Admin Dashboard**
  - Real-time stats (waitlist count, purchases, revenue)
  - Manage launch settings (date, pricing, product info)
  - View and manage waitlist subscribers
  - View purchase history
  - Email template editor and preview
  - Secure admin authentication
- **Analytics**
  - Vercel Analytics integration
  - Conversion tracking
  - Source attribution

---

## 🖥️ Prerequisites

- **Node.js** (LTS recommended, v18+)
- Package manager:
  - **npm** (works out of the box)
  - **pnpm** (optional; this repo includes `pnpm-lock.yaml`)
- **Supabase account** (for database and authentication)
- **Stripe account** (for payment processing)

Verify installs:

```bash
node -v
npm -v
# optional
pnpm -v
```

---

## 📦 Install

From this project folder:

### Option A — npm

```bash
npm install
```

### Option B — pnpm

```bash
pnpm install
```

---

## ⚙️ Environment Setup

Create a `.env.local` file in the project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Setting up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings → API
3. Run the database migration script:
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the contents of `scripts/001-create-launch-tables.sql`
   - Execute the script to create tables

### Setting up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your secret key from Developers → API keys
3. For testing, use test mode keys (starts with `sk_test_`)
4. Configure your product pricing in the admin dashboard after first run

---

## ▶️ Run locally

### npm

```bash
npm run dev
```

### pnpm

```bash
pnpm dev
```

Then open:

```text
http://localhost:3000
```

Admin dashboard available at:

```text
http://localhost:3000/admin
```

To stop the server, press `Ctrl + C` in the terminal.

---

## 🧩 Project structure (high level)

- `app/`
  - `page.tsx` – landing page with all sections
  - `layout.tsx` – global layout with theme and analytics
  - `admin/` – admin dashboard pages
    - `page.tsx` – main dashboard with stats
    - `settings/` – launch settings management
    - `waitlist/` – waitlist subscriber management
    - `emails/` – email template preview and editing
    - `purchases/` – purchase history
    - `login/` – admin authentication
  - `checkout/` – Stripe checkout flow
  - `actions/` – server actions for checkout and waitlist
- `components/`
  - `sections/` – landing page sections (hero, features, pricing, etc.)
  - `countdown-timer.tsx` – launch countdown component
  - `waitlist-form.tsx` – email capture form
  - `checkout-button.tsx` – Stripe checkout integration
  - `admin/` – admin dashboard components
  - `ui/` – shared UI primitives (shadcn/ui)
- `lib/`
  - `stripe.ts` – Stripe configuration
  - `email-templates.tsx` – 5-email launch sequence
  - `supabase/` – Supabase client/server utilities
  - `utils.ts` – shared utilities
- `scripts/`
  - `001-create-launch-tables.sql` – database schema
- `public/`
  - Icons and images

---

## 🔧 Common customization

### Update product information
- Edit launch settings in admin dashboard (`/admin/settings`)
- Or modify defaults in `scripts/001-create-launch-tables.sql`

### Customize email sequence
- Edit templates in `lib/email-templates.tsx`
- Preview emails at `/admin/emails/preview`

### Modify landing page sections
- `components/sections/hero.tsx` – hero section
- `components/sections/features.tsx` – features grid
- `components/sections/pricing.tsx` – pricing tiers
- `components/sections/testimonials.tsx` – social proof
- `components/sections/faq.tsx` – frequently asked questions
- `components/sections/cta.tsx` – call-to-action

### Change styling/theme
- `app/globals.css` – global styles and CSS variables
- Tailwind config uses Tailwind v4 (minimal config needed)

---

## 🚀 Deployment

This Next.js app can be deployed to:

- **Vercel** (recommended) – zero-config deployment
- **Netlify** – works with Next.js
- **Railway**, **Render**, **DigitalOcean** – Docker/Node.js hosting

### Environment variables for production

Make sure to set all `.env.local` variables in your hosting platform:
- Set `NEXT_PUBLIC_BASE_URL` to your production domain
- Use production Stripe keys (starts with `sk_live_`)
- Update Supabase URLs if using production instance

---

## 📌 Notes

- **First-time setup**: Run the SQL migration script in Supabase before starting the app
- **Admin access**: Configure authentication in Supabase or modify `/admin/login` page
- **Email sending**: Currently uses preview mode; integrate with email service (SendGrid, Resend, etc.) for production
- **Stripe webhooks**: Configure webhook endpoints in Stripe dashboard for production payment tracking
- If something doesn't start:
  - Make sure Node.js is installed (`node -v`)
  - Re-run dependency install (`npm install` or `pnpm install`)
  - Check that `.env.local` exists with all required variables
  - Verify Supabase tables are created
  - Check terminal output + browser console for errors

---

## 📬 Contact

If you're using this project, experimenting with it, or have ideas to improve it, feel free to reach out:
- LinkedIn: [Bruno M. Guerreiro, Ph.D.](https://www.linkedin.com/in/bmguerreiro/)
