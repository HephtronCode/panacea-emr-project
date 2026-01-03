import { body } from "express-validator";

export const validateRegister = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Name is required")
		.isLength({ min: 2 })
		.withMessage("Name must be at least 2 characters"),
	body("email")
		.trim()
		.isEmail()
		.withMessage("Must be a valid email address")
		.normalizeEmail(),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters"),
	// Optional: .matches(/\d/).withMessage('Must contain a number')
	body("role")
		.optional()
		.isIn(["patient", "doctor", "nurse", "admin", "receptionist"])
		.withMessage("Invalid role provided"),
];

export const validateLogin = [
	body("email").trim().isEmail().withMessage("Valid email required"),
	body("password").notEmpty().withMessage("Password required"),
];
