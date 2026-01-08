import cron from "node-cron";
import axios from "axios";
import logger from "../utils/logger.js";

export const startKeepAlive = () => {
	// Run every 14 minutes to prevent Render's 15-minute sleep cycle
	cron.schedule("*/14 * * * *", async () => {
		const url = process.env.SELF_URL || "http://localhost:5000/api/health";

		try {
			const res = await axios.get(url);
			logger.info(`[KEEP-ALIVE] Ping sent to ${url}. Status: ${res.status}`);
		} catch (error) {
			logger.error(`[KEEP-ALIVE] Ping failed: ${error.message}`);
		}
	});
};
