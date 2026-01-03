import Patient from "../models/Patient.js";
import asyncHandler from "express-async-handler";
import { logAudit } from "../services/auditService.js";

// @desc Register new patient
// @route POST /api/patients
// @access Private
export const addPatient = asyncHandler(async (req, res) => {
	const { name, email, phone, dob, gender, address, medicalHistory } = req.body;

	// check if patient already exist
	const patientExists = await Patient.findOne({ phone });

	if (patientExists) {
		res.status(400);
		throw new Error("patient already registered with this phone number");
	}
	const patient = await Patient.create({
		name,
		email,
		phone,
		dob,
		gender,
		address,
		medicalHistory,
		registeredBy: req.user._id, // This gets the ID from authMiddleware
	});
	res.status(200).json({
		status: "success",
		data: patient,
	});
});

// @desc Get all patients
// @route GET /api/patients
// @access Private(Staff only)
export const getPatients = asyncHandler(async (req, res) => {
	const patients = await Patient.find({})
		.populate("registeredBy", "name email")
		.sort({ createdAt: -1 });

	res.status(200).json({
		count: patients.length,
		status: "success",
		data: patients,
	});
});

// @desc  Get single Patient profile
// @route  GET /api/patients/:id
// @access Private(Staff only)
export const getPatientById = asyncHandler(async (req, res) => {
	const patient = await Patient.findById(req.params.id).populate(
		"registeredBy",
		"name"
	); // This shows who added them

	if (patient) {
		res.status(200).json({ status: "success", data: patient });
	} else {
		res.status(404);
		throw new Error("Patient not found");
	}
});

// @desc   Update Patient details
// @route  PUT /api/patients/:id
export const updatePatient = asyncHandler(async (req, res) => {
	const patient = await Patient.findById(req.params.id);

	if (patient) {
		// this code would allow updating individual fiels dynamically
		patient.name = req.body.name || patient.name;
		patient.phone = req.body.phone || patient.phone;
		patient.dob = req.body.dob || patient.dob;
		patient.email = req.body.email || patient.email;
		patient.address = req.body.address || patient.address;
		patient.gender = req.body.gender || patient.gender;
		patient.medicalHistory = req.body.medicalHistory || patient.medicalHistory;

		const updatePatient = await patient.save();
		res.status(200).json({
			status: "success",
			data: updatePatient,
		});
	} else {
		res.status(404);
		throw new Error("Patient not found");
	}
});

// @desc  Soft Delete Patient (Archive)
// @route  DELETE /api/patients/:id
export const deletePatient = asyncHandler(async (req, res) => {
	const patient = await Patient.findById(req.params.id);

	if (!patient) {
		res.status(404);
		throw new Error("Patient not found");
	}

	// Soft Delete Logic
	patient.isDeleted = true;
	patient.deletedAt = new Date();
	await patient.save();

	// Audit Log
	await logAudit(
		req.user,
		"PATIENT_ARCHIVE",
		`Archived patient record: ${patient.name}`,
		patient.id,
		req
	);
	res
		.status(200)
		.json({ status: "success", message: "Patient archived successfully" });
});
