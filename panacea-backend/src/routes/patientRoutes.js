import express from "express";
import {
	addPatient,
	getPatients,
	getPatientById,
	updatePatient,
	deletePatient,
} from "../controllers/patientController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

router.route("/").get(getPatients).post(addPatient);

router
	.route("/:id")
	.get(getPatientById)
	.put(updatePatient)
	.delete(authorize("admin", "doctor"), deletePatient);

export default router;
