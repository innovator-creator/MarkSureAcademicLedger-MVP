# Backend Port Auto-Detection System

This directory contains scripts for automatically detecting and configuring the backend API URL.

## Scripts

### `detect-backend-port.js`
Automatically detects the backend server port by checking common ports (5000-5004, 3001, 8000, 8080) and updates `.env.local` with the correct `NEXT_PUBLIC_API_URL`.

**Usage:**
```bash
npm run detect-port
```

### `test-api-connection.js`
Tests API endpoints to verify the connection is working correctly.

**Usage:**
```bash
npm run test-api
```

### `verify-connection.js`
Comprehensive verification script that runs all checks and verifies the frontend-backend connection.

**Usage:**
```bash
node scripts/verify-connection.js
```

## Automatic Port Detection

The `predev` script in `package.json` automatically runs port detection before starting the dev server:

```bash
npm run dev
```

This ensures `.env.local` is always up-to-date with the correct backend port.

## How It Works

1. The script checks common ports for a running backend server
2. It tests the `/health` endpoint to confirm it's the correct server
3. Updates `.env.local` with the detected port
4. All frontend API calls use `NEXT_PUBLIC_API_URL` from `.env.local`

## Manual Override

To manually set the backend URL, edit `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

