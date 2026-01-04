import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Ensure we connect before the tests start
export const connect = async () => {
    // This would forces a separate test database
    // Replaces the actual Db name in the connection string with "panacea_test"
    const mongoUri = process.env.MONGO_URI || process.env.Mongo_URI;
    if (!mongoUri) {
        throw new Error("MONGO_URI environment variable is not defined");
    }
    const testURI = mongoUri.replace(/\/[^/?]+(\?|$)/, "/panacea_test$1");

    // Check the state before connecting (0 = disconnected)
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(testURI)
    }
};

    // Clean up and close after tests finish
    export const close = async () => {
        if (mongoose.connection.readyState !== 0) {
            // Drop the test database so next run is clean
            await mongoose.connection.db.dropDatabase();
            await mongoose.connection.close();
        }
}