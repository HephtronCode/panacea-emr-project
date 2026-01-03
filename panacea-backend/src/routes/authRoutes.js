import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

// Validation Imports
import {
	validateRegister,
	validateLogin,
} from "../validators/authValidators.js";
import { validateRequest } from "../middleware/validatorMiddleware.js";

const router = express.Router();

// The chain: Rule Array -> Check Middleware -> Controller
router.post("/register", validateRegister, validateRequest, register);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User Authentication & Management
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate User
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 default: doctor@hospital.com
 *               password:
 *                 type: string
 *                 default: securepassword123
 *     responses:
 *       200:
 *         description: Login successful with JWT
 *       401:
 *         description: Invalid credentials
 */
// router.post('/login', ...)
router.post("/login", validateLogin, validateRequest, login);
router.get("/me", protect, getMe);

export default router;
