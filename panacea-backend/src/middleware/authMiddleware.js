import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
	let token;

	// Check if the handler exists and starts with Bearer
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			// Get token from header and split to get the actual token
			token = req.headers.authorization.split(" ")[1];

			// verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// Get user from the ID in the token
			req.user = await User.findById(decoded.id).select("-password");

			next();
		} catch (error) {
			console.error(error);
			res.status(401);

			throw new Error("Not authorized, token failed");
		}
	}

	if (!token) {
		res.status(401);
		throw new Error("Not authorized, no token");
	}
});
