# Panacea Frontend (React + Vite)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Install

```bash
cd panacea-frontend
pnpm install
```

### Configure Environment

Create `.env` in `panacea-frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Run

```bash
# Run frontend only
pnpm dev

# Or from repository root, run API + UI together
pnpm run dev
```

### Docker (Production-like)

The root `docker-compose.yml` builds and serves the UI via Nginx:

```bash
docker compose up --build
docker compose down
```

Access UI at http://localhost:3000. API is expected at http://localhost:5000/api.

### Build & Preview

```bash
pnpm build
pnpm preview
```

## Notes

- Axios base URL is taken from `VITE_API_URL` (defaults to `http://localhost:5000/api`).
- Uses shadcn/ui, Tailwind CSS v4, React Router, and TanStack Query.
 - Auth state managed via `src/context/AuthContext.jsx` with JWT stored in localStorage.
