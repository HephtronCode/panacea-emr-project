import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		action: {
			type: String, // e.g., "PATIENT_ADMISSION"
			required: true,
		},
		details: {
			type: String, // e.g., "Admitted John Doe to Bed E-1"
			required: true,
		},
		resourceId: {
			type: mongoose.Schema.Types.ObjectId, // The Patient ID or Bed ID involved
		},
		ip: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
