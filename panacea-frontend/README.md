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

### Build & Preview

```bash
pnpm build
pnpm preview
```

## Notes

- Axios base URL is taken from `VITE_API_URL` (defaults to `http://localhost:5000/api`).
- Uses shadcn/ui, Tailwind CSS v4, React Router, and TanStack Query.
