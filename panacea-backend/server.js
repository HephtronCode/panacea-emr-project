import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { startKeepAlive } from "./src/services/cronService.js";

// Load the env var
dotenv.config();

// Production startup safety check for JWT secret
if (process.env.NODE_ENV === "production") {
	const weakSecrets = new Set([
		"CHANGE_ME_IN_PRODUCTION",
		"__REPLACE_ME__JWT_SECRET__",
		"development_secret_key_12345",
		"changeme",
		"secret",
		"password",
		"12345",
		"jwt_secret",
		"jwtsecret",
		"default",
		"dev",
		"development",
	]);
	const secret = process.env.JWT_SECRET || "";
	if (weakSecrets.has(secret)) {
		console.error(
			"[FATAL] In production, JWT_SECRET must be a strong, unique value. Refusing to start with a known weak placeholder."
		);
		process.exit(1);
	}
}

const PORT = process.env.PORT || 5000;

// connection to the database
connectDB();

app.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}`);
	console.log(`Environment: ${process.env.NODE_ENV}`);

	// Start the keep-alive cron job
	startKeepAlive();
});
