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

## Production Deployment

### Frontend (Vercel / Netlify / Cloudflare Pages)

1. Build command: `npm run build -w frontend`
2. Output directory: `frontend/dist`
3. Environment variable: `VITE_API_URL=https://api.yourdomain.com`

### Backend (Railway / Render / Fly.io / VPS)

1. Build command: `npm run build -w backend`
2. Start command: `npm run start -w backend`
3. Mount persistent volumes for `uploads/` and `data/`
4. Environment variables:

```env
PORT=3001
FRONTEND_URL=https://guestbook.yourdomain.com
PRINTER_CLIENT_TOKEN=<strong-random-secret>
BASE_URL=https://api.yourdomain.com
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

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
