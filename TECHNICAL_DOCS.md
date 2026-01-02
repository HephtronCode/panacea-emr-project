# 📘 Panacea Technical Documentation

## Architecture Overview

### System Design

Panacea follows a **client-server architecture** with clear separation of concerns:

```
┌─────────────────────┐
│   React Frontend    │ ← User Interface Layer
│   (Port 5173)       │
└──────────┬──────────┘
           │ HTTP/REST
           │ JSON
┌──────────▼──────────┐
│   Express Backend   │ ← Business Logic Layer
│   (Port 5000)       │
└──────────┬──────────┘
           │ Mongoose ODM
┌──────────▼──────────┐
│   MongoDB Database  │ ← Data Persistence Layer
└─────────────────────┘
```

### Technology Choices & Rationale

| Technology         | Purpose            | Why Chosen                                                   |
| ------------------ | ------------------ | ------------------------------------------------------------ |
| **React 19**       | Frontend framework | Modern hooks, concurrent features, wide ecosystem            |
| **Vite**           | Build tool         | Fast HMR, optimized production builds                        |
| **TanStack Query** | Server state       | Automatic caching, background refetching, optimistic updates |
| **shadcn/ui**      | Component library  | Accessible, customizable, owns the code                      |
| **Express 5**      | Backend framework  | Minimal, flexible, mature ecosystem                          |
| **MongoDB**        | Database           | Document model fits medical records, flexible schemas        |
| **Mongoose**       | ODM                | Schema validation, middleware, relationships                 |
| **JWT**            | Authentication     | Stateless, scalable, works across devices                    |

---

## Backend Architecture

### Application Structure

```
panacea-backend/
├── server.js                    # Entry point - DB connection + server start
└── src/
    ├── app.js                   # Express app configuration
    ├── config/
    │   └── db.js                # MongoDB connection logic
    ├── models/                  # Mongoose schemas
    │   ├── User.js              # Staff authentication
    │   ├── Patient.js           # Patient demographics
    │   ├── Appointments.js      # Appointment scheduling
    │   ├── MedicalRecord.js     # Clinical documentation
    │   ├── Ward.js              # Bed/ward management
    │   └── AuditLog.js          # System activity tracking
    ├── controllers/             # Request handlers
    │   ├── authController.js
    │   ├── patientController.js
    │   ├── appointmentController.js
    │   ├── recordController.js
    │   ├── wardController.js
    │   └── analyticsController.js
    ├── routes/                  # API route definitions
    │   ├── authRoutes.js
    │   ├── patientRoutes.js
    │   ├── appointmentRoutes.js
    │   ├── recordRoutes.js
    │   ├── wardRoutes.js
    │   └── analyticsRoutes.js
    ├── services/                # Business logic services
    │   └── auditService.js      # Service for creating audit logs
    ├── utils/                   # Shared utility functions
    │   ├── apiResponse.js       # Standardized response helper
    │   └── logger.js            # Winston logger config
    ├── validators/              # Request validation schemas
    │   └── authValidators.js    # Auth-specific validation logic
    └── middleware/
        ├── authMiddleware.js    # JWT verification + role checks
        ├── errorMiddleware.js   # Global error handler
        ├── roleMiddleware.js    # Role-based restriction helper
        └── validatorMiddleware.js # Middleware to run validators
```

### Data Models

#### User Schema

```javascript
{
  name: String,
  email: String (unique, indexed),
  password: String (hashed, not selected by default),
  role: Enum ['patient', 'doctor', 'nurse', 'admin', 'receptionist'],
  timestamps: { createdAt, updatedAt }
}

Methods:
- generateAuthToken() → JWT
- matchPassword(plaintext) → Boolean
```

#### Patient Schema

```javascript
{
  name: String,
  email: String (optional),
  phone: String (unique, required),
  dob: Date,
  gender: Enum ['Male', 'Female', 'Other'],
  address: String,
  medicalHistory: [String],
  registeredBy: ObjectId → User,
  timestamps: { createdAt, updatedAt }
}
```

#### Appointment Schema

```javascript
{
  patient: ObjectId → Patient,
  doctor: ObjectId → User,
  date: Date,
  reason: String,
  status: Enum ['Pending', 'Completed', 'Cancelled', 'No-Show'],
  notes: String,
  createdBy: ObjectId → User,
  timestamps: { createdAt, updatedAt }
}
```

#### Ward Schema

```javascript
{
  name: String (unique),
  type: Enum ['General', 'ICU', 'Emergency', 'maternity', 'Pediatric'],
  capacity: Number,
  occupied: Number,
  beds: [{
    number: String,
    isOccupied: Boolean,
    patient: ObjectId → Patient
  }],
  timestamps: { createdAt, updatedAt }
}
```

#### MedicalRecord Schema

```javascript
{
  patient: ObjectId → Patient,
  doctor: ObjectId → User,
  diagnosis: String,
  treatment: String,
  medications: [String],
  notes: String,
  visitDate: Date,
  timestamps: { createdAt, updatedAt }
}
```

#### AuditLog Schema

```javascript
{
  user: ObjectId → User,   // Who performed the action
  action: String,          // e.g., 'PATIENT_ADMISSION'
  details: String,         // Human-readable description
  resourceId: ObjectId,    // ID of the affected resource (optional)
  ip: String,              // IP address of the requester
  timestamps: { createdAt }
}
```

### Authentication Flow

```
1. User submits credentials → POST /api/auth/login
2. authController.login validates email/password
3. User.matchPassword() compares bcrypt hashes
4. generateAuthToken() creates signed JWT
5. JWT returned to client with user data (no password)
6. Client stores JWT in localStorage/context
7. Subsequent requests include JWT in Authorization header
8. authMiddleware.protect() verifies JWT
9. Decoded user attached to req.user
10. Protected route handler executes
```

### Middleware Pipeline

```javascript
// Global Middleware (app.js)
express.json(); // Parse JSON bodies
cors(); // Handle cross-origin requests
helmet(); // Security headers
morgan("dev"); // HTTP logging
errorHandler; // Catch-all error handler

// Route-Specific Middleware
protect; // Verify JWT
restrictTo(...roles); // Check user roles
```

### Error Handling Strategy

All async route handlers use `express-async-handler`:

```javascript
import asyncHandler from "express-async-handler";

export const getPatients = asyncHandler(async (req, res) => {
	const patients = await Patient.find();
	res.json(patients);
	// Errors automatically passed to errorMiddleware
});
```

Global error handler formats responses:

```javascript
{
  success: false,
  message: "Error message",
  stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
}
```

---

## Frontend Architecture

### Application Structure

```
panacea-frontend/src/
├── main.jsx                     # React entry point
├── App.jsx                      # Router configuration
├── api/                         # API client modules
│   ├── axios.js                 # Configured axios instance
│   ├── analytics.js
│   ├── appointments.js
│   ├── patients.js
│   ├── records.js
│   └── wards.js
├── components/
│   ├── ui/                      # shadcn/ui components
│   └── theme-provider.jsx       # Dark mode context
├── context/
│   └── AuthContext.jsx          # Authentication state
├── layouts/
│   └── DashboardLayout.jsx      # Sidebar + header shell
├── pages/                       # Route components
│   ├── LoginPage.jsx
│   ├── DashboardOverview.jsx
│   ├── PatientsPage.jsx
│   ├── PatientProfilePage.jsx
│   ├── AppointmentsPage.jsx
│   ├── MedicalRecordsPage.jsx
│   └── WardsPage.jsx
└── lib/
    └── utils.js                 # cn() helper for class merging
```

### State Management Strategy

**Server State (TanStack Query):**

- Patient data
- Appointments
- Medical records
- Ward information
- Analytics

**Client State (React Context):**

- Authentication (user, token)
- Theme preference (dark/light)

**Local Component State (useState):**

- Form inputs
- Modal visibility
- Loading/error states

### API Client Architecture

**Base Configuration (axios.js):**

```javascript
const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
	headers: { "Content-Type": "application/json" },
});

// Request interceptor - attach JWT
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

// Response interceptor - handle 401
api.interceptors.response.use(
	(response) => response.data,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.clear();
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);
```

**Feature-Specific Modules:**
Each API module exports typed functions:

```javascript
// patients.js
export const getPatients = () => api.get("/patients");
export const getPatient = (id) => api.get(`/patients/${id}`);
export const createPatient = (data) => api.post("/patients", data);
export const updatePatient = (id, data) => api.put(`/patients/${id}`, data);
export const deletePatient = (id) => api.delete(`/patients/${id}`);
```

### Routing Architecture

**Public Routes:**

- `/login` - Authentication page

**Protected Routes (Dashboard Layout):**

- `/dashboard` - Analytics overview
- `/dashboard/patients` - Patient registry
- `/dashboard/patients/:id` - Patient profile
- `/dashboard/appointments` - Appointment scheduler
- `/dashboard/records` - Medical records
- `/dashboard/wards` - Ward management

**Route Protection:**
Implemented via AuthContext checking token presence:

```javascript
<Route path="/dashboard" element={
  <PrivateRoute>
    <DashboardLayout />
  </PrivateRoute>
}>
```

### Form Validation

**Stack:** Zod + React Hook Form + shadcn/ui Form components

```javascript
const schema = z.object({
	name: z.string().min(1, "Name required"),
	phone: z.string().regex(/^\d{10}$/, "Invalid phone"),
	dob: z.date(),
	gender: z.enum(["Male", "Female", "Other"]),
});

const form = useForm({
	resolver: zodResolver(schema),
});
```

---

## Security Considerations

### Backend Security

1. **Password Security**

   - bcrypt hashing with salt rounds
   - Passwords excluded from query results (`select: false`)

2. **JWT Security**

   - Signed with secret key
   - 30-day expiration
   - Verified on every protected route

3. **HTTP Security**

   - Helmet.js for security headers
   - CORS whitelist configuration
   - Rate limiting (recommended for production)

4. **Input Validation**
   - Mongoose schema validation
   - Email regex validation
   - Enum constraints for status fields

### Frontend Security

1. **Token Storage**

   - localStorage (consider httpOnly cookies for production)
   - Cleared on logout/401

2. **XSS Prevention**

   - React automatic escaping
   - DOMPurify for user-generated HTML (if needed)

3. **CSRF Protection**
   - JWT in Authorization header (not cookies)
   - No CSRF vulnerability with bearer tokens

---

## Performance Optimizations

### Backend

1. **Database Indexing**

   - User email (unique index)
   - Patient phone (unique index)
   - Timestamps for sorting

2. **Query Optimization**

   - `.lean()` for read-only queries
   - `.select()` to limit returned fields
   - Pagination for large datasets

3. **Connection Pooling**
   - Mongoose default pool size: 5
   - Configurable via MongoDB URI options

### Frontend

1. **Code Splitting**

   - React.lazy for route-based splitting
   - Dynamic imports for large components

2. **Caching Strategy**

   ```javascript
   useQuery({
   	queryKey: ["patients"],
   	queryFn: getPatients,
   	staleTime: 5 * 60 * 1000, // 5 minutes
   	cacheTime: 10 * 60 * 1000, // 10 minutes
   });
   ```

3. **Image Optimization**

   - Use WebP format
   - Lazy loading with Intersection Observer

4. **Bundle Size**
   - Tree shaking with Vite
   - Dynamic imports for charts (recharts)

---

## Testing Strategy

### Recommended Tests

**Backend:**

```
Unit Tests (Jest)
├── Models - Schema validation
├── Controllers - Business logic
├── Middleware - Auth verification
└── Utilities - Helper functions

Integration Tests (Supertest)
├── API endpoints
├── Authentication flow
└── CRUD operations
```

**Frontend:**

```
Unit Tests (Vitest)
├── Components - UI rendering
├── Utilities - Helper functions
└── Hooks - Custom hooks

Integration Tests (React Testing Library)
├── User flows
├── Form submission
└── API interactions

E2E Tests (Playwright/Cypress)
├── Login flow
├── Patient registration
└── Appointment scheduling
```

---

## Deployment Guide

### Backend Deployment

**Environment Setup:**

```bash
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=strong_random_secret
JWT_EXPIRE=30d
```

**Build Steps:**

```bash
pnpm install --prod
NODE_ENV=production node server.js
```

**Recommended Platforms:**

- Railway
- Render
- AWS EC2
- DigitalOcean

### Frontend Deployment

**Build:**

```bash
pnpm build
# Output: dist/
```

**Environment Variables:**

```bash
VITE_API_URL=https://api.yourapp.com/api
```

**Recommended Platforms:**

- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

### Database

**MongoDB Atlas** (Recommended):

- Managed hosting
- Automatic backups
- Scalable

**Self-Hosted:**

- Docker container
- MongoDB replica set for production

---

## Monitoring & Logging

### Backend Logging

**Morgan** for HTTP requests:

```
GET /api/patients 200 45.123 ms - 1234
```

**Production Recommendations:**

- Winston for structured logging
- Log aggregation (Logtail, Datadog)
- Error tracking (Sentry)

**Local Log Files:**

- API writes to `panacea-backend/logs/all.log` and `panacea-backend/logs/error.log`. Verbosity is `debug` in development and `warn` otherwise.

### Frontend Monitoring

**Recommendations:**

- React Error Boundaries
- Sentry for error tracking
- Analytics (PostHog, Mixpanel)
- Performance monitoring (Web Vitals)

---

## Common Issues & Solutions

### CORS Errors

**Problem:** Frontend can't reach backend  
**Solution:** Add frontend URL to `allowedOrigins` in [app.js](panacea-backend/src/app.js)

---

## Local Development Workflow

Run both servers concurrently from the repository root using provided scripts:

```bash
# Install backend and frontend dependencies
pnpm run install-all

# Start API (port 5000) and UI (port 5173) together
pnpm run dev

# Or run individually
pnpm run backend   # API only
pnpm run frontend  # UI only
```

Environment variables:

```env
# panacea-backend/.env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/panacea
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d

# panacea-frontend/.env
VITE_API_URL=http://localhost:5000/api
```

Access URLs:

- UI: http://localhost:5173
- API Base: http://localhost:5000/api

### JWT Expiration

**Problem:** User logged out unexpectedly  
**Solution:** Implement refresh token mechanism

### MongoDB Connection Issues

**Problem:** Connection timeout  
**Solution:** Check network, whitelist IP in Atlas, verify connection string

### Hot Reload Not Working

**Problem:** Changes not reflecting  
**Solution:** Check Vite config, ensure .env changes restart server

---

## API Response Standards

### Success Response

```json
{
	"success": true,
	"data": {
		/* resource data */
	},
	"message": "Operation successful"
}
```

### Error Response

```json
{
	"success": false,
	"message": "Error description",
	"errors": [
		/* validation errors */
	]
}
```

### Pagination Response

```json
{
	"success": true,
	"data": [
		/* items */
	],
	"pagination": {
		"page": 1,
		"limit": 10,
		"total": 156,
		"pages": 16
	}
}
```

---

## Contributing Guidelines

### Code Style

**Backend:**

- ESM imports (`import/export`)
- Async/await over callbacks
- Descriptive variable names
- Comment complex logic

**Frontend:**

- Functional components + hooks
- PascalCase for components
- camelCase for functions/variables
- Extract reusable logic to hooks

### Commit Convention

```
feat: Add ward bed assignment
fix: Resolve appointment date validation
docs: Update API documentation
refactor: Simplify patient controller
test: Add user authentication tests
```

### Pull Request Process

1. Create feature branch
2. Write tests
3. Update documentation
4. Submit PR with description
5. Pass CI checks
6. Code review
7. Merge to main

---

**Last Updated:** December 2025  
**Maintained By:** Development Team
