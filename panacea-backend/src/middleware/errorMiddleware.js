import logger from "../utils/logger.js";
import { apiResponse } from "../utils/apiResponse.js";

export const errorHandler = (err, req, res, next) => {
	// 1. Log the Error with Stack Trace
	logger.error(
		`${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${
			req.method
		} - ${req.ip}`
	);

	if (process.env.NODE_ENV !== "production") {
		logger.error(err.stack);
	}

	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

	// 2. Mongoose Bad ObjectId (CastError)
	if (err.name === "CastError") {
		const message = `Resource not found with id of ${err.value}`;
		return apiResponse(res, 404, message);
	}

	// 3. Mongoose Duplicate Key (E11000)
	if (err.code === 11000) {
		const message = "Duplicate field value entered";
		return apiResponse(res, 400, message);
	}

	// 4. Mongoose Validation Error
	if (err.name === "ValidationError") {
		const messages = Object.values(err.errors).map((val) => val.message);
		return apiResponse(res, 400, "Data validation failed", null, {
			errors: messages,
		});
	}

	// 5. Default Error
	apiResponse(res, statusCode, err.message, null, {
		stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
	});
};
