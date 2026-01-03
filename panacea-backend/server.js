import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";

// Load the env var
dotenv.config();

const PORT = process.env.PORT || 5000;

// connection to the database
connectDB();

app.listen(PORT, () => {
	console.log(`Server running on port: ${PORT}`);
	console.log(`Environment: ${process.env.NODE_ENV}`);
});
