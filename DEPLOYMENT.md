# Deploying Codepilot on Render (100% free tier)

| Component | Service | Plan |
| --- | --- | --- |
| Web app (Next.js 16) | Render — Web Service | **Free** |
| Database | MongoDB Atlas | **M0, free forever** |
| Authentication | GitHub + Google OAuth | **Free** |

> **Free-tier note:** Render's free web service sleeps after ~15 minutes of
> inactivity. The first request after sleep takes 30–60 seconds (a "cold
> start"). MongoDB Atlas M0 never sleeps.

---

## 0. If you see a bare "Not Found" page

That plain white **"Not Found"** is Render's own response when no successful
deploy is serving the domain — it is not a Codepilot page. Check, in order:

1. **Render → your service → Deploys.** The latest deploy must say
   **"Live"**. If it failed, open the build log — the fix is usually below.
2. **Settings → Root Directory must be EMPTY.** `package.json` lives at the
   repository root now (the old zip layout is gone).
3. **Settings → Branch = `main`**, and the latest commit is the Codepilot v1
   merge.
4. Build command: `npm install && npx prisma generate && npm run build`
5. Start command: `npm start`
6. **Manual Deploy → Clear build cache & deploy.**
7. Confirm the service actually owns `code-pilot-ai-editor.onrender.com` —
   if you created more than one service, the subdomain may point at an older
   one. Delete or rename the stale service.
8. Node version: the blueprint pins 22.x. For a manual service add
   `NODE_VERSION=22.12.0` (Next.js 16 will not build on Node 18).

---

## 1. MongoDB Atlas — free database

1. Create an account at <https://www.mongodb.com/cloud/atlas> and deploy an
   **M0 Free** cluster.
2. **Database Access** → *Add New Database User*: username `codepilot_user`,
   a strong password (save it), permissions *Read and write to any database*.
3. **Network Access** → *Add IP Address* → *Allow Access from Anywhere*
   (`0.0.0.0/0`). Required because Render free services have no static IP.
4. **Clusters → Connect → Drivers**, copy the connection string and fill in
   the password and database name:

   ```text
   mongodb+srv://codepilot_user:<PASSWORD>@cluster0.3amwwry.mongodb.net/codepilot?retryWrites=true&w=majority&appName=Cluster0
   ```

Collections are created automatically on the first write — no migration
command is needed.

---

## 2. OAuth credentials

### GitHub

1. <https://github.com/settings/developers> → **OAuth Apps** → *New OAuth App*.
2. Homepage URL: `https://<your-app>.onrender.com`
3. Callback URL:
   `https://<your-app>.onrender.com/api/auth/callback/github`

### Google

1. <https://console.cloud.google.com/apis/credentials> → *Create Credentials*
   → **OAuth client ID** → *Web application*.
2. Authorized JavaScript origin: `https://<your-app>.onrender.com`
3. Authorized redirect URI:
   `https://<your-app>.onrender.com/api/auth/callback/google`

A mismatch here causes `redirect_uri_mismatch` (Google) or a GitHub 404 page —
the URLs must match exactly, including `https://`.

---

## 3. Deploy with the blueprint (recommended)

The repository includes `render.yaml`:

1. Push to GitHub, then Render Dashboard → **New + → Blueprint**.
2. Connect the repository. Render creates a free web service named
   `codepilot`.
3. Paste the variables marked `sync: false`: `DATABASE_URL`,
   `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `AUTH_GOOGLE_ID`,
   `AUTH_GOOGLE_SECRET`. `AUTH_SECRET` is generated automatically.
4. Click **Apply** (first build takes 4–7 minutes).
5. Open `https://<your-app>.onrender.com/auth/sign-in` and test both
   sign-in buttons end to end.

### Manual service (if you did not use the blueprint)

| Setting | Value |
| --- | --- |
| Runtime | Node |
| Build command | `npm install && npx prisma generate && npm run build` |
| Start command | `npm start` |
| Root Directory | *(empty)* |
| Instance type | Free |
| Health check path | `/auth/sign-in` |

Environment variables: the five `sync: false` values above plus
`AUTH_TRUST_HOST=true`, `NODE_VERSION=22.12.0`, and a generated
`AUTH_SECRET` (`openssl rand -base64 32`).

---

## 4. Why the build is reliable

- `postinstall` tolerates a skipped `prisma generate`, and the build command
  runs `npx prisma generate` explicitly — the Prisma Client always matches
  `prisma/schema.prisma`.
- One web service serves the UI and the server actions — no separate backend
  bill.
- JWT sessions need no Redis or session store.
- The live preview compiles JSX in the browser — no build workers required.

---

## 5. Local development

```bash
npm install
cp .env.example .env   # fill in real values
npm run dev
```

For local OAuth, add `http://localhost:3000/api/auth/callback/github` (and the
Google equivalent) as **additional** callback URLs — keep the production ones.

---

## 6. Troubleshooting

| Symptom | Fix |
| --- | --- |
| Bare "Not Found" on every URL | No successful deploy — see section 0. |
| `@prisma/client did not initialize yet` | Build skipped `prisma generate`; use the exact build command above and clear the build cache. |
| `redirect_uri_mismatch` / GitHub 404 after clicking login | Callback URL in the OAuth console must exactly match `/api/auth/callback/<provider>` on your Render domain. |
| Atlas timeout / `querySrv ENOTFOUND` | Allow `0.0.0.0/0` in Atlas Network Access; verify the password in `DATABASE_URL`. |
| Infinite redirect to sign-in | Check `AUTH_SECRET` exists and `AUTH_TRUST_HOST=true`. |
| First load is slow | Cold start on the free plan; allow up to a minute. |
| Sign-in works but data does not persist | DB name must be `codepilot`; the DB user needs read/write permissions. |
| Build fails with Node engine errors | Pin `NODE_VERSION=22.12.0`. |
