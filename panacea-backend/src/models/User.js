import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please provide a name"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Please provide an email"],
			unique: true, // Indexes this field for faster search and no duplicates
			lowercase: true,
			trim: true,
			match: [
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				"Please provide a valid email",
			], // Regex validation to ensure proper input of an email
		},
		password: {
			type: String,
			required: [true, "Please provide a password"],
			minlenght: 6,
			select: false, // This ensures password is not returned in the queries
		},
		role: {
			type: String,
			enum: ["patient", "doctor", "nurse", "admin", "receptionist"],
			default: "patient",
		},
	},
	{ timestamps: true }
);

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
	return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

// Method to check password match
// We need to compare the plain text from the login with the hashed one in the DB
userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

// Create the model from the schema
const User = mongoose.model("User", userSchema);

export default User;
