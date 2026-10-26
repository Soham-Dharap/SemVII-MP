# Deploying Codepilot on Render (100% free tier)

This guide takes you from a fresh clone to a live Codepilot instance without
paying for anything:

| Component | Service | Plan |
| --- | --- | --- |
| Web app (Next.js 16) | Render — Web Service | **Free** |
| Database | MongoDB Atlas | **M0, free forever** |
| Authentication | GitHub + Google OAuth | **Free** |

> **Free-tier note:** Render's free web service sleeps after ~15 minutes of
> inactivity. The first request after sleep takes 30–60 seconds (a "cold
> start"). Subsequent requests are fast. MongoDB Atlas M0 never sleeps.

---

## 1. MongoDB Atlas — free database

1. Create an account at <https://www.mongodb.com/cloud/atlas> and deploy an
   **M0 Free** cluster (choose any region, e.g. AWS Mumbai).
2. **Database Access** (sidebar) → *Add New Database User*:
   - Username `codepilot_user`, a strong password (save it).
   - Permissions: *Read and write to any database*.
3. **Network Access** → *Add IP Address* → *Allow Access from Anywhere*
   (`0.0.0.0/0`). This is required because Render's free services do not get
   static IPs.
4. **Clusters → Connect → Drivers** and copy the connection string, filling
   in the password and database name:

   ```text
   mongodb+srv://codepilot_user:<PASSWORD>@cluster0.3amwwry.mongodb.net/codepilot?retryWrites=true&w=majority&appName=Cluster0
   ```

   No migration command is needed: Prisma creates collections automatically on
   the first write.

---

## 2. OAuth credentials

### 2a. GitHub sign-in

1. Go to <https://github.com/settings/developers> → **OAuth Apps** → *New
   OAuth App*.
2. Fill in:
   - **Application name:** Codepilot
   - **Homepage URL:** `https://code-pilot-ai-editor.onrender.com`
   - **Authorization callback URL:**
     `https://code-pilot-ai-editor.onrender.com/api/auth/callback/github`
3. Save the **Client ID**, then generate and save the **Client Secret**.

If your Render URL changes, update the callback URL here.

### 2b. Google sign-in

1. Go to <https://console.cloud.google.com/apis/credentials> → *Create
   Credentials* → **OAuth client ID** → application type *Web application*.
2. **Authorized JavaScript origins:**
   `https://code-pilot-ai-editor.onrender.com`
3. **Authorized redirect URIs:**
   `https://code-pilot-ai-editor.onrender.com/api/auth/callback/google`
4. Save the **Client ID** and **Client Secret**.

---

## 3. Deploy to Render with the blueprint

The repository includes `render.yaml`, so the service is preconfigured:

- **Build command:** `npm install && npx prisma generate && npm run build`
- **Start command:** `npm start`
- **Health check:** `/auth/sign-in`
- `AUTH_SECRET` is generated automatically.

Steps:

1. Push this repository to GitHub.
2. Open the Render Dashboard → **New + → Blueprint**.
3. Connect the repository. Render reads `render.yaml` and creates a free web
   service named `codepilot`.
4. Render prompts for the environment variables marked `sync: false`. Paste:
   - `DATABASE_URL` — the Atlas string from step 1.
   - `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` — from step 2a.
   - `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` — from step 2b.
   - `AUTH_TRUST_HOST` and `AUTH_URL` are already set by the blueprint.
5. Click **Apply**. The first build takes 4–7 minutes.
6. When the deploy is live, open
   <https://code-pilot-ai-editor.onrender.com/auth/sign-in> and test both
   sign-in buttons.

### If the service gets a different URL

Render names the URL after the service name. If yours differs (for example
`codepilot-1.onrender.com`):

1. Update `AUTH_URL` in **Render → Environment**.
2. Update the callback URLs in the GitHub and Google consoles.
3. Trigger a manual deploy.

---

## 4. How the build stays free and reliable

- `package.json` runs `prisma generate` in `postinstall`, and the build command
  runs it again explicitly, so the Prisma Client always matches
  `prisma/schema.prisma` — no "Client did not initialize yet" errors.
- The app uses a single web service: Next.js serves both the UI and the server
  actions, so there is no separate backend bill.
- Session strategy is JWT — no extra session database or Redis instance is
  required.
- The live preview compiles React/JSX inside the browser (Babel Standalone);
  no build containers or worker services are needed.

---

## 5. Local development

```bash
npm install
cp .env.example .env   # fill in real values
npx prisma generate
npm run dev
```

Open <http://localhost:3000>. For local OAuth testing, add
`http://localhost:3000/api/auth/callback/github` (and the Google equivalent)
as additional callback URLs in your OAuth apps — do not remove the production
URLs.

---

## 6. Troubleshooting

| Symptom | Fix |
| --- | --- |
| `@prisma/client did not initialize yet` | The build skipped `prisma generate`. Confirm the Render build command matches the blueprint and redeploy. |
| `redirect_uri_mismatch` (GitHub/Google) | The callback URL in the OAuth console must exactly match `https://<your-app>.onrender.com/api/auth/callback/<provider>`. |
| Atlas timeout / `querySrv ENOTFOUND` | Add `0.0.0.0/0` under Atlas → Network Access, and verify the password in `DATABASE_URL`. |
| Infinite redirect to sign-in | Check `AUTH_SECRET` exists and `AUTH_TRUST_HOST=true`. |
| First load is slow | Free services sleep; allow up to a minute for the cold start. |
| Sign-in works but data does not persist | Verify the database name in `DATABASE_URL` is `codepilot` and the DB user has read/write permissions. |
