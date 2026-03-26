<p align="center">
  <img src="public/favicon.png" alt="HealthPay Logo" width="80" height="80" style="border-radius: 16px;" />
</p>
## 👥 Team CEREBRAL

| Name | Role | Contributions |
|---|---|---|
| **MUBARAK RAJI** | Full-Stack Developer | Built the patient and provider dashboards, booking flow, payment integration (Interswitch Inline Checkout + server-side verification), Supabase schema design, RLS policies, and API routes |
| **OLADELE OLAWALE** | Research & Documentation | Competitive research, user stories, and wrote the project documentation and README |
| *OGUNTUYI AISHA* | UI/UX Designer | Designed all screens, user flows, and visual identity — including patient portal, provider dashboard, and booking experience |(Wasn't able to register for the hackathon due to team limit)
| *RAMADAN ONI* | Project Manager | Coordinated team tasks, managed timelines and deliverables, facilitated communication, and ensured the project met buildathon requirements |
| **ADAM MORUFAT** | QA/Tester | Wrote and executed test cases for the booking flow, payment scenarios, and dashboard features; verified Interswitch sandbox transactions and reported bugs |
> Every listed member actively contributed to delivering HealthPay within the buildathon timeline.

# 🏥 HealthPay

**Healthcare Payments Made Simple** — A full-stack digital healthcare payment and appointment platform built for the [Enyata Buildathon 2026](https://buildathon.enyata.com/).

> Book appointments, pay securely via Interswitch, and manage your healthcare journey — all in one place.

---

## ✨ Features

### For Patients
- 📅 **Book Appointments** — Select a service, provider, date & time
- 💳 **Pay Securely** — Interswitch Inline Checkout (Verve, Mastercard, Visa, Bank Transfer)
- 🧾 **Digital Receipts** — Instant confirmation with transaction details
- 📊 **Dashboard** — Track appointments, payment history, and profile

### For Healthcare Providers
- 📋 **Manage Appointments** — View, search, and filter patient appointments
- 💰 **Track Revenue** — Real-time transaction monitoring and analytics
- 🏥 **Manage Services** — Add, edit, and remove healthcare services
- 👥 **Patient Records** — Aggregated patient visit and spending data
- ⚙️ **Settings** — Profile management and payment configuration

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), TypeScript, React |
| **Styling** | Tailwind CSS v4, Inter font |
| **Backend** | Next.js API Routes |
| **Database** | Supabase (PostgreSQL) |
| **Payments** | Interswitch Inline Checkout |
| **Auth** | Custom email/password auth via Supabase |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com/) project
- Interswitch test credentials (included below)

### 1. Clone & Install

```bash
git clone https://github.com/your-repo/healthpay.git
cd healthpay
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The Interswitch test credentials are pre-filled in `.env.example`.

### 3. Database Setup

Copy the contents of `supabase/schema.sql` and run it in your **Supabase SQL Editor** (Dashboard → SQL Editor → New Query → Paste → Run).

This will:
- Create all tables (`users`, `providers`, `services`, `appointments`, `transactions`)
- Set up Row Level Security policies
- Seed demo providers and services
- Create a test user: `testing@healthpay.com` / `testing`

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing Payments

This project uses **Interswitch's test sandbox** — no real money is involved.

### Test Login Credentials

| Field | Value |
|---|---|
| Email | `testing@healthpay.com` |
| Password | `testing` |

> This account works for **both** Patient and Provider dashboards.

### Test Card Details

Use these card details when the Interswitch payment popup appears:

![Test card numbers and PIN for Interswitch sandbox](/CardsandPin.png)

| Card Type | Card Number | Expiry | CVV | PIN |
|---|---|---|---|---|
| Verve | `5061050254756707864` | 06/26 | 111 | 1111 |
| Visa | `4000000000002503` | 03/50 | 111 | — |
| Mastercard | `5123450000000008` | 01/39 | 100 | 1111 |

### OTP Verification

When prompted for OTP, use these values:

![OTP values for test card transactions](/Otpforcards.png)

| Card | OTP |
|---|---|
| Mastercard | `123456` |
| Verve | No OTP required |
| Visa | No OTP required |

> ⚠️ **Do NOT use real card details.** This is a test environment.

---

## 📁 Project Structure

```
healthpay/
├── app/
│   ├── home/               # Landing page
│   ├── patient/
│   │   ├── login/          # Patient authentication
│   │   └── dashboard/      # Patient portal
│   │       ├── overview/
│   │       ├── appointments/
│   │       ├── payments/
│   │       └── profile/
│   ├── provider/
│   │   ├── login/          # Provider authentication
│   │   └── dashboard/      # Provider portal
│   │       ├── overview/
│   │       ├── appointments/
│   │       ├── transactions/
│   │       ├── services/
│   │       ├── patients/
│   │       └── settings/
│   ├── booking/            # Appointment booking flow
│   └── api/
│       ├── payments/       # Payment verification
│       └── services/       # Services API
├── components/             # Shared React components
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── interswitch.ts      # Interswitch OAuth + requery
│   ├── useInterswitchCheckout.ts  # Inline Checkout hook
│   └── types.ts            # TypeScript types
├── supabase/
│   └── schema.sql          # Database schema + seed data
└── public/
    ├── CardsandPin.png     # Test card reference
    └── Otpforcards.png     # OTP reference
```

---

## 🔐 Security

- **Server-side payment verification** — All transactions are verified via Interswitch's requery API
- **OAuth 2.0** — Server-to-server authentication with token caching
- **Row Level Security** — Supabase RLS policies on all tables
- **No client-side secrets** — `SECRET_KEY` is never exposed to the browser

---

## 📄 License

Built for the [Enyata Buildathon 2026](https://buildathon.enyata.com/).

---

<p align="center">
  <strong>HealthPay</strong> — Making healthcare payments accessible across Nigeria 🇳🇬
</p>
