import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Patient name is required"],
		},
		email: {
			type: String,
			match: [
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				"Please provide a valid email",
			],
		},
		phone: {
			type: String,
			required: [true, "Phone number is required"],
			unique: true, // this ensures that no duplicate number exist
		},
		dob: {
			type: Date,
			require: [true, "Date of Birth is required"],
		},
		gender: {
			type: String,
			enum: ["Male", "Female", "Other"],
			required: true,
		},
		address: {
			type: String,
		},
		medicalHistory: [
			{
				type: String,
			},
		],
		registeredBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		deletedAt: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true }
);

// QUERY MIDDLEWARE (Advanced)
// This automatically filters out deleted items for EVERY query (find, findOne, count)
// so we don't have to remember to add { isDeleted: false } in every controller.
patientSchema.pre(/^find/, function () {
	this.where({ isDeleted: { $ne: true } });
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
