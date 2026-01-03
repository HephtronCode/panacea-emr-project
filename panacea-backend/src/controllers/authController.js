import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import { apiResponse } from "../utils/apiResponse.js"; // <-- NEW IMPORT

// @desc    Register a new user
export const register = asyncHandler(async (req, res) => {
	const { name, email, password, role } = req.body;

	// Check existence (Validator middleware checks format, but we check DB uniqueness here)
	const userExists = await User.findOne({ email });
	if (userExists) {
		// We throw an error, and the Error Middleware (standardized) handles it
		res.status(400);
		throw new Error("User already exists");
	}

	const user = await User.create({ name, email, password, role });
	const token = user.generateAuthToken();

	// Standardized Success Response
	return apiResponse(res, 201, "Registration successful", {
		token,
		user: {
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		},
	});
});

// @desc    Login user
export const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email }).select("+password");
	if (!user || !(await user.matchPassword(password))) {
		res.status(401);
		throw new Error("Invalid email or password");
	}

	const token = user.generateAuthToken();

	return apiResponse(res, 200, "Login successful", {
		token,
		user: {
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		},
	});
});

// @desc    Get current user profile
export const getMe = asyncHandler(async (req, res) => {
	// req.user is already set by authMiddleware
	return apiResponse(res, 200, "User profile fetched", req.user);
});
