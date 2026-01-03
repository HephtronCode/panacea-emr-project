import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import hpp from "hpp";

import rateLimit from "express-rate-limit";

import { errorHandler } from "./middleware/errorMiddleware.js";
import { apiResponse } from "./utils/apiResponse.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";
import wardRoutes from "./routes/wardRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

const app = express();

// --- 1. GLOBAL MIDDLEWARE STACK ---

app.use(helmet());
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: "Too many requests from this IP, please try again after 15 minutes",
	standardHeaders: true,
	legacyHeaders: false,
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
// app.use(mongoSanitize()); // REMOVED
app.use(hpp());

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- 2. HEALTH CHECK ---
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: System Health Check
 *     description: Returns server status, uptime, and environment.
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is operational
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Panacea System Operational
 */
app.get("/api/health", (req, res) => {
	apiResponse(res, 200, "Panacea System Operational", {
		uptime: process.uptime(),
		timestamp: new Date(),
		env: process.env.NODE_ENV,
	});
});

// --- 3. MOUNT ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/wards", wardRoutes);
app.use("/api/analytics", analyticsRoutes);

// --- 4. 404 HANDLER ---
app.use((req, res, next) => {
	const err = new Error(`Can't find ${req.originalUrl} on this server`);
	res.statusCode = 404;
	next(err);
});

// --- 5. GLOBAL ERROR HANDLER ---
app.use(errorHandler);

export default app;
