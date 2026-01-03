import Appointment from "../models/Appointments.js";
import asyncHandler from "express-async-handler";

// @desc Schedule a new appointment
// @route POST /api/appointments
// @access Private
export const bookAppointment = asyncHandler(async (req, res) => {
	const { patientId, doctorId, date, reason } = req.body;

	// Validate required fields
	if (!patientId || !doctorId || !date || !reason) {
		res.status(400);
		throw new Error("Please fill in all fields");
	}

	const appointment = await Appointment.create({
		patient: patientId,
		doctor: doctorId,
		date,
		reason,
		createdBy: req.user._id, // This gets the ID from authMiddleware
	});
	res.status(200).json({
		status: "success",
		data: appointment,
	});
});

// @desc Get all appointments
// @route GET /api/appointments
// @access Private(Staff only)
export const getAppointments = asyncHandler(async (req, res) => {
	const query = req.query.patientId ? { patient: req.query.patientId } : {};
	const appointments = await Appointment.find(query)
		.populate("patient", "name phone")
		.populate("doctor", "name email")
		.sort({ date: 1 });

	res.status(200).json({
		count: appointments.length,
		status: "success",
		data: appointments,
	});
});

// @desc  Update Appointment status or reschedule
// @route  PUT /api/appointments/:id
// @access Private(Staff only)
export const updateAppointment = asyncHandler(async (req, res) => {
	const appointment = await Appointment.findById(req.params.id);

	if (!appointment) {
		res.status(404);
		throw new Error("Appointment not found");
	}

	// Update fields dynamically
	appointment.status = req.body.status || appointment.status;
	appointment.date = req.body.date || appointment.date;
	appointment.reason = req.body.reason || appointment.reason;

	const updatedAppointment = await appointment.save();

	res.status(200).json({
		status: "success",
		data: updatedAppointment,
	});
});
