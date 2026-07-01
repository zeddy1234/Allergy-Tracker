# Daily Log — Allergy & Symptom Tracker

A mobile-first Progressive Web App (PWA) for tracking daily health data,
built for someone managing multiple allergies who needs a simple, frictionless
daily logging habit.

## Features

- **Food log** — track everything eaten each day
- **Exercise log** — log daily activity
- **Sleep tracking** — record hours of sleep
- **Medication log** — track daily medications
- **Symptom tracker** — add symptoms with per-symptom severity (None / Mild / Severe)
- **Smart memory** — anything typed once is remembered and offered as a tappable chip next time, minimizing daily typing
- **History & graphs** — symptom severity plotted over time, filterable by 7 / 14 / 30 / 90 days
- **PWA support** — installable on iPhone via Safari "Add to Home Screen", runs full-screen like a native app

## Tech stack

- **React** + **Vite**
- **Supabase** (PostgreSQL) for cloud data persistence
- **Recharts** for symptom trend graphs
- **Vercel** for deployment

## Motivation

Built for a family member managing multiple allergies who needed a way to spot
patterns between food, sleep, medication, and symptom flare-ups over time —
without paying for a generic app that didn't fit her exact needs.

## Running locally .

```bash
npm install
cp .env.example .env
# Add your Supabase URL and anon key to .env
npm run dev
```

## Environment variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon public key |
