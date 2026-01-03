import Patient from "../models/Patient.js";
import Appointment from "../models/Appointments.js";
import Ward from "../models/Ward.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

// @desc    Get System Stats
// @route   GET /api/analytics/stats
export const getStats = asyncHandler(async (req, res) => {
	// 1. Parallel Execution
	const [patientCount, doctorCount, appointmentCount, wards] =
		await Promise.all([
			Patient.countDocuments(),
			User.countDocuments({ role: "doctor" }),
			Appointment.countDocuments({ status: "Pending" }),
			Ward.find().select("capacity occupied"),
		]);

	// 2. Calculate Occupancy % across entire hospital with SAFEGUARDS
	const totalBeds = wards.reduce((acc, ward) => acc + (ward.capacity || 0), 0);

	// The Fix: Treat missing 'occupied' as 0
	const totalOccupied = wards.reduce(
		(acc, ward) => acc + (ward.occupied || 0),
		0
	);

	// Prevent Division by Zero
	const occupancyRate =
		totalBeds === 0 ? 0 : Math.round((totalOccupied / totalBeds) * 100);

	const trends = [40, 30, 45, 60, 55, 65, patientCount];

	res.status(200).json({
		status: "success",
		data: {
			patients: patientCount,
			doctors: doctorCount,
			appointments: appointmentCount,
			occupancy: occupancyRate, // Now always a number (e.g., 0)
			trends,
		},
	});
});
