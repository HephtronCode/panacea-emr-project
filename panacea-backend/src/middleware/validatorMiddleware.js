import { validationResult } from "express-validator";
import { apiResponse } from "../utils/apiResponse.js";

export const validateRequest = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// Return 422 Unprocessable Entity
		return apiResponse(res, 422, "Validation Error", null, {
			errors: errors.array().map((err) => ({
				field: err.path,
				message: err.msg,
			})),
		});
	}
	next();
};
