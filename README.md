# Wedding Polaroid Guestbook

A production-ready full-stack Progressive Web App for Nisila & Yashmi's wedding. Guests scan a QR code, take a selfie, preview a vintage Polaroid-style print, and send it to a venue printer via a cloud backend.

## Architecture

```
Guest Phone (React PWA)
        │
        ▼
Public Express Backend (REST + Socket.IO)
        │
        ├── Image storage
        ├── FIFO print queue
        └── Socket.IO → Windows Printer Client → Canon SELPHY
```

Guests use any internet connection (mobile data, venue Wi-Fi). The printer is never exposed to the internet — only the venue laptop's Printer Client connects outbound to the backend.

## Packages

| Package | Description |
|---------|-------------|
| `frontend/` | React 19 PWA — camera, Polaroid generator, upload UI |
| `backend/` | Express API, print queue, Socket.IO server |
| `printer-client/` | Windows Node app — downloads jobs and prints locally |

## Quick Start (Local Development)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to configure each package:

**`backend/.env`** (already created for local dev):

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
PRINTER_CLIENT_TOKEN=change-me-to-a-strong-random-secret
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
BASE_URL=http://localhost:3001
```

**`frontend/.env`**:

```env
VITE_API_URL=http://localhost:5173
```

> In dev, the Vite proxy forwards `/api` to the backend. Use an empty or same-origin `VITE_API_URL` so requests go through the proxy.

**`printer-client/.env`**:

```env
BACKEND_URL=http://localhost:3001
PRINTER_CLIENT_TOKEN=change-me-to-a-strong-random-secret
PRINTER_ID=venue-selphy-1
PRINTER_NAME=
```

### 3. Run all services

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |
| Printer Client | Connects via Socket.IO |

Or run individually:

```bash
npm run dev:backend
npm run dev:frontend
npm run dev:printer
```

### 4. Build for production

```bash
npm run build
```

## Production Deployment (Azure Web Apps)

Both frontend and backend deploy as separate **Azure App Service (Linux, Node 20)** Web Apps, kept in sync via GitHub Actions (`.github/workflows/azure-backend.yml` and `azure-frontend.yml`). Each workflow builds the package on GitHub's runners and zip-deploys a self-contained bundle (build output + production `node_modules` only), so Azure doesn't need to run an Oryx build for this monorepo.

### 1. Create the two Web Apps in the Azure Portal

For each app (e.g. `qr-camera-backend` and `qr-camera-frontend`):

1. **Create a resource → Web App**
2. **Publish:** Code · **Runtime stack:** Node 20 LTS · **OS:** Linux
3. Pick a region and an App Service Plan (Basic B1 or higher — the free F1 tier sleeps and has no persistent storage, which breaks Socket.IO connections and the print queue on the backend).
4. After creation, go to **Configuration → General settings** and set the **Startup Command**:
   - Backend: `node dist/server.js`
   - Frontend: `npm run start`
5. Go to **Configuration → Application settings** and add `SCM_DO_BUILD_DURING_DEPLOYMENT = false` on both (the GitHub Action already ships built artifacts, so Azure shouldn't rebuild).
6. Under **Configuration → General settings**, turn **Web sockets** to **On** for the backend app (required for Socket.IO).

### 2. Wire up GitHub Actions

1. On each Web App, go to **Overview → Get publish profile** and download the `.PublishSettings` file.
2. In the GitHub repo, go to **Settings → Secrets and variables → Actions** and add:
   - Secret `AZURE_BACKEND_PUBLISH_PROFILE` — contents of the backend's publish profile
   - Secret `AZURE_FRONTEND_PUBLISH_PROFILE` — contents of the frontend's publish profile
   - Variable `VITE_API_URL` — the backend's URL, e.g. `https://qr-camera-backend.azurewebsites.net` (baked into the frontend bundle at build time)
3. Push to `main` (or run the workflows manually from the **Actions** tab) — each workflow only triggers when its package's files change.

If you named your Web Apps something other than `qr-camera-backend` / `qr-camera-frontend`, update the `AZURE_WEBAPP_NAME` value at the top of both workflow files to match.

### 3. Backend Application Settings

On the backend Web App, set these under **Configuration → Application settings**:

```env
FRONTEND_URL=https://qr-camera-frontend.azurewebsites.net
PRINTER_CLIENT_TOKEN=<strong-random-secret>
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

`PORT` and `BASE_URL` don't need to be set — Azure injects `PORT`/`WEBSITES_PORT` automatically, and the backend falls back to `https://<WEBSITE_HOSTNAME>` for `BASE_URL` when unset. Set `FRONTEND_URL` to your exact frontend Web App URL so CORS allows guest uploads.

> **Persistent storage:** Azure App Service Linux persists `/home` (which includes the deployed app folder) across restarts, but **not** across new deployments — each deploy replaces `uploads/` and `data/`. For a one-day event this is usually fine; for anything longer-lived, mount an Azure Storage file share under **Configuration → Path mappings** and point `UPLOAD_DIR` at it.

### Important notes

- `VITE_API_URL` must point at the **public backend** Web App — there is no API proxy in production.
- Camera access requires HTTPS — Azure Web Apps provide this by default on `*.azurewebsites.net`.
- Point your wedding QR code at the frontend Web App URL (or a custom domain mapped to it).
- Redeploy the frontend after changing `VITE_API_URL` (it's baked in at build time).

### Printer Client (Windows laptop at venue)

1. Install Node.js 18+
2. Copy `printer-client/` to the laptop
3. Configure `.env` with production `BACKEND_URL` and matching `PRINTER_CLIENT_TOKEN`
4. Set `PRINTER_NAME` to your Canon SELPHY name (run `Get-Printer` in PowerShell to list)
5. Start before guests arrive:

```bash
npm run start -w printer-client
```

The client auto-reconnects if the connection drops. Print jobs queue on the backend until it reconnects.

## QR Code

Generate a QR code pointing to your **frontend** URL only:

```
https://guestbook.yourdomain.com
```

Place it on the guestbook table. No special Wi-Fi or app install required (PWA install is optional).

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/photos` | Upload Polaroid image (multipart `image`) |
| `GET` | `/api/photos/:jobId` | Get print job status |
| `GET` | `/api/photos/:jobId/image` | Download job image (requires `X-Printer-Token`) |
| `GET` | `/api/printer/status` | Printer connection & queue status |
| `GET` | `/api/printer/queue` | Current print queue |
| `GET` | `/api/health` | Health check |

## Customization

Edit [`frontend/src/config/polaroid.config.ts`](frontend/src/config/polaroid.config.ts) to change couple names, wedding date, border sizes, fonts, and output resolution without touching rendering logic.

Edit [`frontend/src/config/wedding.config.ts`](frontend/src/config/wedding.config.ts) for landing page copy.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Camera not working | Requires HTTPS in production (or localhost in dev). Check browser camera permissions. |
| Upload fails | Verify backend is running and `FRONTEND_URL` CORS matches your frontend domain. |
| Printer not printing | Ensure Printer Client is running, token matches backend, and `PRINTER_NAME` is correct. |
| Jobs stuck in queue | Check Printer Client console for errors. Jobs resume when client reconnects. |
| Token mismatch | `PRINTER_CLIENT_TOKEN` must be identical in backend and printer-client `.env` files. |

## Venue Day Checklist

- [ ] Backend deployed with persistent storage
- [ ] Frontend deployed with correct `VITE_API_URL`
- [ ] Printer Client running on venue laptop
- [ ] Test print from your phone before guests arrive
- [ ] QR code printed and placed on guestbook table
- [ ] Canon SELPHY loaded with paper
- [ ] Laptop plugged in and connected to internet

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, MUI, React Router, TanStack Query, Axios, Framer Motion, PWA

**Backend:** Node.js, Express, Socket.IO, Multer, TypeScript

**Printer Client:** Node.js, Socket.IO Client, Windows Print Spooler
