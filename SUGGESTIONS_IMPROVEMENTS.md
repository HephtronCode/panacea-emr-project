# Panacea Project — Suggestions & Improvements

This document summarizes proposed robustness, security, and UX improvements across the backend and frontend. It is intended as a reference plan to implement incrementally, without disrupting existing functionality.

## Goals

- Improve API reliability, security, and consistency
- Enhance frontend resilience and user experience
- Make debugging and operations easier with better logging and audit trails
- Keep changes backward-compatible wherever possible

---

## Backend (Node.js / Express)

- **Security Hardening:** Add `express-rate-limit`, `express-mongo-sanitize`, `xss-clean`, `hpp` to mitigate abuse and injection.
- **Input Validation:** Centralize validators using `express-validator` (e.g., `validateLogin`, `validateRegister`, `validatePatient`, `validateAppointment`, `validateMedicalRecord`, `validateMongoId`, `validatePagination`, `validateSearch`). Ensure validators export consistent middleware arrays.
- **Auth & RBAC:** Keep `protect` for authentication and `authorize(roles...)` for role-based access on sensitive routes.
- **Standardized Responses:** Use a shared `apiResponse` helper to return `{ success, data, message, meta }` consistently.
- **Audit Logging:** Introduce `AuditLog` model and `auditService` to record critical actions (create/update/delete, auth events).
- **Token Model:** Add `RefreshToken` model to support secure token rotation and logout invalidation.
- **Notifications:** Optional `Notification` model + endpoints for system/user alerts (e.g., appointment reminders, ward status changes).
- **Pagination & Filtering:** Default pagination for list endpoints; query params: `page`, `limit`, `q` for search; consistent meta in responses.
- **Soft Delete:** Implement `deletedAt` on critical entities (`Patient`, `MedicalRecord`) + restore endpoints; ensure indexes include `{ deletedAt: 1 }` when relevant.
- **Indexes & Performance:** Add unique and compound indexes (e.g., `User.email`, `Patient.phone`, `Ward.name`). Avoid duplicate index declarations.
- **Error Handling:** Unified `errorMiddleware` that logs details and returns sanitized messages; map common Mongo/Mongoose errors.
- **Logging:** Configure `winston` logger with levels, timestamps, and environment-based transports.
- **API Consistency:** Align route naming and HTTP verbs (e.g., `GET /patients`, `POST /appointments`, `PUT /wards/:id/admit`, `PUT /wards/:id/discharge`).
- **Health Check:** Expose `GET /api/health` reporting `uptime`, `status`, and `db` connectivity.

---

## Frontend (React + Vite)

- **Axios Interceptor:** Centralize base URL, auth headers, and automatic token refresh on 401.
- **Auth Context:** Manage `accessToken`/`refreshToken`, persist minimally, and react to token refresh/failure.
- **Error Boundaries:** Wrap app-level routes with `ErrorBoundary` to catch render/runtime errors.
- **Query Client:** Use TanStack Query for data fetching, caching, retry/backoff, and request deduplication.
- **Consistent UI Feedback:** Standardize loading states, skeletons, and error toasts across pages (Patients, Appointments, Records, Wards).
- **Environment Config:** Read `VITE_API_URL` from env; fall back to sensible default; avoid hard-coded hosts.
- **Accessibility & UX:** Ensure form labels, focus states, keyboard navigation, and clear error messages.

---

## API Contracts & Validation

- **Auth:**
  - `POST /auth/register` → `validateRegister`
  - `POST /auth/login` → `validateLogin`
  - `POST /auth/refresh` → refresh via `RefreshToken`
- **Patients:**
  - `GET /patients` → `validatePagination`
  - `POST /patients` → `validatePatient`
  - `GET /patients/:id` → `validateMongoId`
  - `PUT /patients/:id` → `validateMongoId`, `validatePatientUpdate`
  - `DELETE /patients/:id` → `validateMongoId`
  - `PUT /patients/:id/restore` → `validateMongoId`
- **Appointments:**
  - `GET /appointments` → `validatePagination`
  - `POST /appointments` → `validateAppointment`
  - `GET /appointments/:id` → `validateMongoId`
  - `PUT /appointments/:id` → `validateMongoId`, `validateAppointmentUpdate`
  - `PUT /appointments/:id/cancel` → `validateMongoId`
- **Medical Records:**
  - `GET /records` → `validatePagination`
  - `POST /records` → `validateMedicalRecord`
  - `GET /records/:id` → `validateMongoId`
  - `GET /records/patient/:patientId` → `validatePagination` (controller should validate `patientId`)
- **Wards:**
  - `GET /wards` → public/paginated
  - `POST /wards` → admin-only
  - `GET /wards/:id` → `validateMongoId`
  - `PUT /wards/:id` → admin-only, `validateMongoId`
  - `GET /wards/:id/available-bed` → `validateMongoId`
  - `PUT /wards/:id/admit` → `validateMongoId`, `validateWardAdmission`
  - `PUT /wards/:id/discharge` → `validateMongoId`, `validateWardDischarge`

---

## Operations & Observability

- **Environment Management:** `.env` with `PORT`, `NODE_ENV`, `MONGODB_URI`, `JWT_SECRET`, `REFRESH_TOKEN_TTL`, `RATE_LIMIT_*`.
- **Health & Readiness:** `/api/health` endpoint and DB connectivity checks on startup.
- **Structured Logs:** Request/response logging with correlation IDs; error logs include stack traces in non-production.
- **Metrics (Optional):** Integrate lightweight metrics (e.g., Prometheus client) for request latency and error rate.

---

## Testing & Quality Gates

- **Unit Tests:** Models, services, and controllers (auth, patient, appointment flows).
- **Integration Tests:** API endpoints with an in-memory Mongo (or isolated DB).
- **Contract Tests:** Ensure response schema shape is consistent across endpoints.
- **Linting & Formatting:** Enforce ESLint + Prettier rules; CI checks on PR.

---

## Deployment Notes

- **Node Version:** Ensure Node v20.19+ or v22.12+ (Vite requires this; prefer same version across dev/CI/prod).
- **Start Scripts:** `pnpm dev` with concurrent `backend` + `frontend`; `pnpm start` for production builds.
- **Config Separation:** Keep environment-specific config in `.env.*` files; do not hard-code URLs.
- **Rollback Strategy:** Use `git stash` or dedicated branches to preserve work during large refactors.

---

## Implementation Guidance

- Apply changes incrementally, starting with validation and error handling.
- Keep middleware shapes consistent (validators export arrays, not callables with param names).
- Avoid duplicate Mongoose index definitions (choose either `index: true` on schema fields or `schema.index()`).
- Add feature flags for new models/routes (e.g., Notifications, Audit) to enable gradual rollout.

---

## Status Legend (for future tracking)

- Planned: Not started yet
- In Progress: Under active development
- Implemented: Completed and verified
- Deferred: Postponed for later release
