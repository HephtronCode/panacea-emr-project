/**
 * Standardized API Response Structure
 * @param {Response} res - Express response object
 * @param {number} statusCode - HTTP Status Code
 * @param {string} message - Human readable message
 * @param {object} data - Payload
 * @param {object} meta - Pagination or extra metadata
 */
export const apiResponse = (
	res,
	statusCode,
	message,
	data = null,
	meta = null
) => {
	const success = statusCode >= 200 && statusCode < 300;

	res.status(statusCode).json({
		success,
		message,
		data,
		meta,
		timestamp: new Date().toISOString(),
	});
};
