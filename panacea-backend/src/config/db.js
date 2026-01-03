import mongoose from "mongoose";

const connectDB = async () => {
	try {
		// connecting to the database
		const conn = await mongoose.connect(process.env.MONGO_URI);

		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		// exit process with failure code (1)
		process.exit(1);
	}
};

export default connectDB;
