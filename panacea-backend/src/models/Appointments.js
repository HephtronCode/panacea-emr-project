import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
	{
		patient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Patient",
			required: true,
		},
		doctor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		date: {
			type: Date,
			required: [true, "Appointment date is required"],
		},
		reason: {
			type: String,
			required: [true, "Reason for appointment is required"],
		},
		status: {
			type: String,
			enum: ["Pending", "Completed", "Cancelled", "No-Show"],
			default: "Pending",
		},
		notes: {
			type: String,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
