import MedicalRecord from "../models/MedicalRecord.js";
import Appointment from "../models/Appointments.js";
import asyncHandler from "express-async-handler";

// @desc   Create new medical record
// @route  POST /api/records
// @access Private (Doctor)
export const createRecord = asyncHandler(async (req, res) => {
	const {
		patientId,
		appointmentId,
		vitals,
		diagnosis,
		treatment,
		prescriptions,
		notes,
	} = req.body;

	// Create the record
	const record = await MedicalRecord.create({
		patient: patientId,
		doctor: req.user._id,
		appointment: appointmentId || null,
		vitals,
		diagnosis,
		treatment,
		prescriptions,
		notes,
	});

	if (appointmentId) {
		await Appointment.findByIdAndUpdate(appointmentId, { status: "Completed" });
	}
	res.status(201).json({
		status: "success",
		data: record,
	});
});

// @desc   Get all the records for a specific patient
// @route  GET /api/records/:patientId
export const getpatientHistory = asyncHandler(async (req, res) => {
	const records = await MedicalRecord.find({ patient: req.params.patientId })
		.populate("doctor", "name email")
		.sort({ createAt: -1 });

	res.status(200).json({
		count: records.length,
		status: "success",
		data: records,
	});
});

// @desc  Get all recent records (Admin/Doctor view)
// @route GET /api/records/all
export const getAllRecords = asyncHandler(async (req, res) => {
	const records = await MedicalRecord.find({})
		.populate("patient", "name gender dob")
		.populate("doctor", "name")
		.sort({ createdAt: -1 })
		.limit(20); // Fetch recent 20 records

	res.status(200).json({
		status: "success",
		count: records.length,
		data: records,
	});
});
