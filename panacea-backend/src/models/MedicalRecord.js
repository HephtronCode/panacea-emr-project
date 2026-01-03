import mongoose from "mongoose";

const MedicalRecordSchema = new mongoose.Schema(
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
		appointment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Appointment",
			required: false,
		},
		// Embedded vitals
		vitals: {
			bloodPressure: { type: String, default: "N/A" },
			temperature: { type: Number, required: true },
			pulse: { type: Number, required: true },
			weight: { type: Number, required: true }, // in kg
		},
		diagnosis: {
			type: String,
			required: [true, "Diagnosis is required"],
		},
		treatment: { type: String, required: [true, "Treatment is required"] },

		// Embedded array of Object
		prescriptions: [
			{
				medicine: { type: String, required: true },
				dosage: { type: String, required: true },
				frequency: { type: String, required: true },
				duration: { type: String, required: true },
			},
		],
		notes: { type: String },
	},
	{ timestamps: true }
);

// Add indexes for frequently queried fields
MedicalRecordSchema.index({ patient: 1 });
MedicalRecordSchema.index({ doctor: 1 });
MedicalRecordSchema.index({ appointment: 1 });
MedicalRecordSchema.index({ createdAt: -1 });

const MedicalRecord = mongoose.model("MedicalRecord", MedicalRecordSchema);

export default MedicalRecord;
