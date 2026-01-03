# Panacea Backend (Node + Express)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)
- MongoDB running locally or Atlas

### Install

```bash
cd panacea-backend
pnpm install
```

### Configure Environment

Create `.env` in `panacea-backend/` with:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/panacea
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
```

### Run

```bash
# Development (nodemon)
pnpm dev

# Production
pnpm start
```

From the repository root you can also run both API and UI concurrently:

```bash
pnpm run dev        # starts API (5000) + UI (5173)
pnpm run backend    # API only
pnpm run frontend   # UI only
```

### API Base

- http://localhost:5000/api

### Logs

- API logs are written to `panacea-backend/logs/all.log` and `panacea-backend/logs/error.log`.
- Log level is `debug` when `NODE_ENV=development`, otherwise `warn`.

### Notes

- Entry point: `server.js` (loads env, connects DB, starts server)
- App configuration: `src/app.js`
- Database connection: `src/config/db.js`
- Routes/controllers/models under `src/`
