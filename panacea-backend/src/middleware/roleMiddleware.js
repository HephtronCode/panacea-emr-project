import { apiResponse } from "../utils/apiResponse.js";

// The wrapper function accepts an array of allowed roles
// for example ("admin", "doctor")
export const authorize = (...roles) => {
	return (req, res, next) => {
		// check if req.user is already set by the "protect" middleware
		if (!req.user || !roles.includes(req.user.role)) {
			return apiResponse(
				res,
				403,
				`User role "${req.user?.role}" is not authorized to access this route`
			);
		}
		next();
	};
};
