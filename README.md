# 🏥 Panacea Hospital Management System

A modern, full-stack hospital management platform built with React 19 and Node.js (Express 5) for streamlined patient care, appointment scheduling, and clinical operations.

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- MongoDB v6+
- pnpm (recommended) or npm

### Installation & Run

```bash
# Option A: Install both apps from the root (Windows/macOS/Linux)
pnpm run install-all

# Option B: Install separately
cd panacea-backend && pnpm install && cd ../panacea-frontend && pnpm install

# Configure backend environment (create or edit panacea-backend/.env)
# Required keys shown below in the Environment Variables section

# Run both API and UI together (concurrently)
pnpm run dev

# Or run individually
pnpm run backend   # starts API (port 5000)
pnpm run frontend  # starts UI  (port 5173)
```

**Access:**
- UI: http://localhost:5173
- API Base: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## 📦 Tech Stack

**Frontend:**
- **React 19.2** + **Vite 7.2**
- **TanStack Query v5** (Server State Management)
- **React Router v7**
- **Tailwind CSS v4** + **shadcn/ui**
- **Recharts** (Analytics)
- **Zod** + **React Hook Form** (Validation)

**Backend:**
- **Node.js** + **Express v5.2**
- **MongoDB** + **Mongoose v9**
- **JWT Authentication** (jsonwebtoken + bcryptjs)
- **Security:** Helmet, CORS, HPP, Express Rate Limit
- **Logging:** Winston + Morgan

## 🎯 Core Features

| Feature                 | Description                                                     |
| ----------------------- | --------------------------------------------------------------- |
| **Authentication**      | Role-based access (Admin, Doctor, Nurse, Receptionist, Patient) |
| **Patient Registry**    | Complete patient profiles with medical history tracking         |
| **Appointments**        | Schedule, manage, and track appointment statuses                |
| **Medical Records**     | Digital clinical records management                             |
| **Ward Management**     | Real-time bed occupancy and ward allocation                     |
| **Analytics Dashboard** | Visual insights into hospital operations                        |
| **Audit Logging**       | Comprehensive tracking of system activities for compliance      |

## 📁 Project Structure

```
panacea-project/
├── panacea-backend/          # Express REST API
│   ├── server.js             # Entry point (Server & DB setup)
│   └── src/
│       ├── app.js            # Express app config
│       ├── models/           # Mongoose schemas (User, Patient, AuditLog, etc.)
│       ├── controllers/      # Business logic handlers
│       ├── routes/           # API endpoint definitions
│       ├── middleware/       # Auth, roles, validation & error handling
│       ├── services/         # Internal services (e.g., Audit Service)
│       ├── utils/            # Helper functions & API response wrappers
│       ├── validators/       # Request validation schemas
│       └── config/           # Database & environment config
│
└── panacea-frontend/         # React SPA
    └── src/
        ├── pages/            # Route components
        ├── components/       # UI components (shadcn/ui & custom)
        ├── api/              # Axios API client modules
        ├── context/          # Auth & Global state
        ├── layouts/          # Dashboard shells
        ├── lib/              # Utility functions
        └── dev/              # Developer tools & previews
```

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api`

| Category | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| **Auth** | POST | `/auth/login` | User authentication |
| | POST | `/auth/register` | New user registration (Staff) |
| **Patients** | GET | `/patients` | List all patients |
| | POST | `/patients` | Register new patient |
| | GET | `/patients/:id` | Patient details |
| | PUT | `/patients/:id` | Update patient |
| | DELETE | `/patients/:id` | Remove patient |
| **Appointments** | GET | `/appointments` | List appointments |
| | POST | `/appointments` | Create appointment |
| | PUT | `/appointments/:id` | Update appointment |
| | DELETE | `/appointments/:id` | Cancel appointment |
| **Records** | GET | `/records` | List medical records |
| | POST | `/records` | Create record |
| | GET | `/records/patient/:id`| Patient records |
| | PUT | `/records/:id` | Update record |
| **Wards** | GET | `/wards` | Ward list with occupancy |
| | POST | `/wards` | Create ward |
| | PUT | `/wards/:id` | Update ward/beds |
| | DELETE | `/wards/:id` | Remove ward |
| **Analytics** | GET | `/analytics` | Dashboard metrics |
| **System** | GET | `/health` | API health check |

## 🔐 Environment Variables

**Backend (`panacea-backend/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/panacea
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
```

**Frontend (`panacea-frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

## 🛠️ Development

```bash
# Backend development with hot reload
cd panacea-backend
pnpm dev

# Frontend development server
cd panacea-frontend
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🛡️ Security & Reliability

- **RBAC:** Strict role-based access control for all clinical endpoints.
- **Audit Trails:** Every major action is logged in the `AuditLog` collection.
- **Rate Limiting:** Prevents brute force and DoS attacks.
- **Data Integrity:** Mongoose validation combined with centralized validator logic.
- **Logging:** Centralized logging with Winston (logs available in `panacea-backend/logs`).

## 📖 Documentation

- [PRD.md](./PRD.md) - Product Requirements Document
- [TECHNICAL_DOCS.md](./TECHNICAL_DOCS.md) - Deep dive into architecture and technical details
- [AGENTS.md](./AGENTS.md) - Documentation for AI agent interactions
- [SUGGESTIONS_IMPROVEMENTS.md](./SUGGESTIONS_IMPROVEMENTS.md) - Future roadmap and improvements

## 🚧 Roadmap

- [ ] Lab results integration
- [ ] Prescription management
- [ ] Inventory tracking
- [ ] Billing system
- [ ] Patient portal
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Report generation (PDF)

## 📄 License

ISC License - see [package.json](./package.json) for details.

---

**Built with ❤️ for modern healthcare operations**
