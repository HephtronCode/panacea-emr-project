import AuditLog from "../models/AuditLog.js";
import logger from "../utils/logger.js"; // We leverage your Winston logger too

export const logAudit = async (
	user,
	action,
	details,
	resourceId = null,
	req = null
) => {
	try {
		await AuditLog.create({
			user: user._id,
			action,
			details,
			resourceId,
			ip: req?.ip || "0.0.0.0",
		});
		// Also pipe to Winston for file logging
		logger.info(`[AUDIT] ${user.name} performed ${action}: ${details}`);
	} catch (error) {
		// We don't want audit failure to crash the main request
		logger.error(`Audit logging failed: ${error.message}`);
	}
};
