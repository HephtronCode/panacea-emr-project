import Ward from "../models/Ward.js";
import asyncHandler from "express-async-handler";
import { apiResponse } from "../utils/apiResponse.js";
import { logAudit } from "../services/auditService.js";

// @desc    Get all wards and bed status
// @route   GET /api/wards
export const getWards = asyncHandler(async (req, res) => {
	const wards = await Ward.find({}).populate("beds.patient", "name gender");

	return apiResponse(res, 200, "Wards fetched successfully", wards);
});

// @desc    Initialize Default Hospital Wards (One-time setup)
// @route   POST /api/wards/seed
export const seedWard = asyncHandler(async (req, res) => {
	const existing = await Ward.countDocuments();

	if (existing > 0) {
		res.status(400);
		throw new Error("Wards already initialized");
	}

	const wards = [
		{ name: "Emergency Room", type: "Emergency", capacity: 6 },
		{ name: "ICU Alpha", type: "ICU", capacity: 4 },
		{ name: "General Ward A", type: "General", capacity: 8 },
	];

	// Generate bed objects based on capacity
	for (let w of wards) {
		w.beds = Array.from({ length: w.capacity }, (_, i) => ({
			number: `${w.name.charAt(0)}-${i + 1}`, // e.g., E-1, E-2
			isOccupied: false,
		}));
	}

	await Ward.insertMany(wards);

	// Log this system event
	await logAudit(
		req.user,
		"SYSTEM_INIT",
		"Initialized Hospital Ward Layout",
		null,
		req
	);

	return apiResponse(res, 201, "Hospital Wards Constructed");
});

// @desc    Admit Patient to a Bed
// @route   PUT /api/wards/:id/admit
export const admitPatient = asyncHandler(async (req, res) => {
	const { patientId, bedId } = req.body;

	// Validate required fields
	if (!patientId || !bedId) {
		res.status(400);
		throw new Error("Patient ID and Bed ID are required");
	}

	const ward = await Ward.findById(req.params.id);

	if (!ward) {
		res.status(404);
		throw new Error("Ward not found");
	}

	// Find the specific bed inside the ward
	const bed = ward.beds.id(bedId);

	if (!bed) {
		res.status(404);
		throw new Error("Bed not found in this ward");
	}

	if (bed.isOccupied) {
		res.status(400);
		throw new Error("Bed is already taken");
	}

	// Perform Admission
	bed.isOccupied = true;
	bed.patient = patientId;
	ward.occupied = (ward.occupied || 0) + 1;

	await ward.save();

	// 🔍 AUDIT LOGGING
	await logAudit(
		req.user,
		"PATIENT_ADMISSION",
		`Admitted patient to ${ward.name} - Bed ${bed.number}`,
		patientId, // Resource ID is the patient
		req
	);

	return apiResponse(res, 200, "Patient admitted successfully", ward);
});

// @desc    Discharge Patient from Bed
// @route   PUT /api/wards/:id/discharge
export const dischargePatient = asyncHandler(async (req, res) => {
	const { bedId } = req.body;

	if (!bedId) {
		res.status(400);
		throw new Error("Bed ID is required");
	}

	const ward = await Ward.findById(req.params.id);

	if (!ward) {
		res.status(404);
		throw new Error("Ward not found");
	}

	const bed = ward.beds.id(bedId);

	if (!bed) {
		res.status(404);
		throw new Error("Bed not found in this ward");
	}

	if (!bed.isOccupied) {
		res.status(400);
		throw new Error("Bed is already free");
	}

	// Store patient ID for logs before clearing it
	const patientId = bed.patient;

	// Perform Discharge
	bed.isOccupied = false;
	bed.patient = null;
	// Prevent negative numbers with Math.max
	ward.occupied = Math.max(0, (ward.occupied || 0) - 1);

	await ward.save();

	// 🔍 AUDIT LOGGING
	await logAudit(
		req.user,
		"PATIENT_DISCHARGE",
		`Discharged patient from ${ward.name} - Bed ${bed.number}`,
		patientId,
		req
	);

	return apiResponse(res, 200, "Patient discharged successfully", ward);
});
