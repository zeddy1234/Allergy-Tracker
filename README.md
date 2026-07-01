# Daily Log — Allergy & Symptom Tracker

A simple daily tracker: food, exercise, sleep, medication, and symptoms (None /
Mild / Severe), with a history view that graphs symptom severity over time.
Anything typed in once is remembered and offered as a tap-able chip next time.

This guide assumes **zero prior experience** with any of these tools. Follow
it top to bottom in order. Total time: about 20–30 minutes the first time.

---

## Part 1 — Set up the database (Supabase)

This is where your sister's daily entries actually get stored, safely, in the
cloud — so they survive even if she gets a new phone.

1. Go to **https://supabase.com** and click **Start your project**. Sign up
   (free — email or GitHub login both work).
2. Click **New project**.
   - Name: anything, e.g. `daily-log`
   - Database password: generate one and save it somewhere (you likely won't
     need it again, but keep it just in case)
   - Region: pick whichever is closest to you
   - Click **Create new project** and wait ~1 minute for it to provision.
3. Once it's ready, open the **SQL Editor** in the left sidebar.
4. Click **New query**.
5. Open the file `supabase_schema.sql` (included in this project), copy
   **all** of its contents, and paste it into the SQL editor.
6. Click **Run** (bottom right). You should see "Success. No rows returned."
   This created two tables: `daily_entries` and `saved_items`.
7. Now go to **Project Settings** (gear icon, bottom of left sidebar) →
   **API**. You'll need two values from this page in Part 2:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon public** key (a long string under "Project API keys")

Keep this tab open — you'll copy these two values in a moment.

---

## Part 2 — Deploy the app (Vercel)

This makes the app live on the internet at a real URL, for free.

1. Go to **https://vercel.com** and click **Sign Up**. The easiest option is
   to sign up with a **GitHub** account — if you don't have one, create a
   free GitHub account first at **https://github.com**.
2. You'll need this project's code in a GitHub repository so Vercel can
   deploy it:
   - Create a new repository on GitHub (e.g. named `daily-log`).
   - Upload all the files from this project folder into that repository.
     (If you're comfortable with git: `git init`, `git add .`,
     `git commit -m "init"`, then push to the new GitHub repo. If not, GitHub's
     web uploader lets you drag-and-drop the whole folder in.)
3. Back in Vercel, click **Add New** → **Project**.
4. Select the GitHub repository you just created and click **Import**.
5. Vercel will auto-detect this as a **Vite** project. Leave the build
   settings as default.
6. Before clicking Deploy, expand **Environment Variables** and add both
   values you copied from Supabase in Part 1:

   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | your Supabase Project URL |
   | `VITE_SUPABASE_ANON_KEY` | your Supabase anon public key |

7. Click **Deploy**. Wait about a minute.
8. You'll get a live URL like `daily-log-yourname.vercel.app`. That's it —
   the app is now live for anyone with the link, no account needed to view
   or use it.

---

## Part 3 — Get it on her iPhone

1. Send her the Vercel URL (text message, etc.).
2. She opens it in **Safari** (must be Safari, not Chrome, for this to work
   on iPhone).
3. Tap the **Share** icon (square with an arrow pointing up) in Safari's
   toolbar.
4. Scroll down and tap **Add to Home Screen**.
5. Tap **Add**.

She'll now have a "Daily Log" icon on her home screen that opens full-screen,
like a regular app.

---

## Updating the app later

If you ever want to change something (colors, wording, add a feature), make
the change in the code, push it to the same GitHub repository, and Vercel
will automatically redeploy — the same URL updates in place, nothing for her
to reinstall.

---

## A note on privacy

This app has no login screen by design, to keep it frictionless for daily
use. That means anyone who has the exact URL could open it and see or edit
the data. For a personal health-tracking tool shared only between you and
your sister, this is a reasonable tradeoff — but don't post the URL publicly
or share it beyond the two of you.

---

## Local development (optional, for further customization)

If you want to run this on your own computer to test changes before
deploying:

```bash
npm install
cp .env.example .env
# edit .env with your real Supabase URL and anon key
npm run dev
```

Then open the local address it prints (usually `http://localhost:5173`).
