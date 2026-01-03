import mongoose from "mongoose";

const wardSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		type: {
			type: String,
			enum: ["General", "ICU", "Emergency", "maternity", "Pediatric"],
			required: true,
		},
		capacity: {
			type: Number,
			required: true,
		},
		occuppied: {
			type: Number,
			default: 0,
		},
		beds: [
			{
				number: String,
				isOccupied: { type: Boolean, default: false },
				patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
			},
		],
	},
	{ timestamps: true }
);

const Ward = mongoose.model("Ward", wardSchema);

export default Ward;
