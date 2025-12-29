# 🏥 Panacea Hospital Management System

A modern, full-stack hospital management platform built with React and Node.js for streamlined patient care, appointment scheduling, and clinical operations.

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- MongoDB v6+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies for all workspaces
pnpm install

# Configure environment variables
cp panacea-backend/.env.example panacea-backend/.env
# Edit .env with your MongoDB URI and JWT secrets

# Start backend (port 5000)
cd panacea-backend
pnpm dev

# Start frontend (port 5173)
cd panacea-frontend
pnpm dev
```

**Access:** http://localhost:5173

## 📦 Tech Stack

**Frontend:**

- React 19 + Vite
- TanStack Query (React Query)
- React Router v7
- Tailwind CSS v4 + shadcn/ui
- Recharts for analytics
- Zod + React Hook Form

**Backend:**

- Node.js + Express v5
- MongoDB + Mongoose
- JWT Authentication
- Helmet + CORS security
- bcrypt for password hashing

## 🎯 Core Features

| Feature                 | Description                                                     |
| ----------------------- | --------------------------------------------------------------- |
| **Authentication**      | Role-based access (Admin, Doctor, Nurse, Receptionist, Patient) |
| **Patient Registry**    | Complete patient profiles with medical history tracking         |
| **Appointments**        | Schedule, manage, and track appointment statuses                |
| **Medical Records**     | Digital clinical records management                             |
| **Ward Management**     | Real-time bed occupancy and ward allocation                     |
| **Analytics Dashboard** | Visual insights into hospital operations                        |

## 📁 Project Structure

```
panacea-project/
├── panacea-backend/          # Express REST API
│   ├── server.js             # Entry point
│   └── src/
│       ├── models/           # Mongoose schemas
│       ├── controllers/      # Business logic
│       ├── routes/           # API endpoints
│       ├── middleware/       # Auth & error handling
│       └── config/           # DB connection
│
└── panacea-frontend/         # React SPA
    └── src/
        ├── pages/            # Route components
        ├── components/       # Reusable UI components
        ├── api/              # Axios API clients
        ├── context/          # Auth context
        └── layouts/          # Dashboard shell
```

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api`

```
POST   /auth/login               # User authentication
POST   /auth/register            # New user registration

GET    /patients                 # List all patients
POST   /patients                 # Register new patient
GET    /patients/:id             # Patient details
PUT    /patients/:id             # Update patient
DELETE /patients/:id             # Remove patient

GET    /appointments             # List appointments
POST   /appointments             # Create appointment
PUT    /appointments/:id         # Update appointment
DELETE /appointments/:id         # Cancel appointment

GET    /records                  # Medical records
POST   /records                  # Create record
GET    /records/patient/:id      # Patient records
PUT    /records/:id              # Update record

GET    /wards                    # Ward list with occupancy
POST   /wards                    # Create ward
PUT    /wards/:id                # Update ward/beds
DELETE /wards/:id                # Remove ward

GET    /analytics                # Dashboard metrics
```

## 🔐 Environment Variables

**Backend (.env):**

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/panacea
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
```

**Frontend (.env):**

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

## 📊 Database Models

- **User** - Staff authentication (doctor, nurse, admin, receptionist)
- **Patient** - Patient demographics and medical history
- **Appointment** - Scheduling with status tracking
- **MedicalRecord** - Clinical documentation
- **Ward** - Bed management and occupancy

## 🎨 UI Components

Built with shadcn/ui:

- Forms with validation
- Data tables with sorting/filtering
- Modals and dialogs
- Charts and analytics
- Responsive navigation

## 🚧 Roadmap

- [ ] Lab results integration
- [ ] Prescription management
- [ ] Inventory tracking
- [ ] Billing system
- [ ] Patient portal
- [ ] Mobile app
- [ ] Real-time notifications
- [ ] Report generation (PDF)

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Built with ❤️ for modern healthcare operations**
