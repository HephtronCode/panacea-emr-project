import express from "express";
import {
	getWards,
	seedWard,
	admitPatient,
	dischargePatient,
} from "../controllers/wardController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js"; // <-- Import it

const router = express.Router();

router.use(protect);

router.get("/", getWards); // Anyone can see wards

// LOCK THIS DOWN: Only Admins can reset the hospital layout
router.post("/seed", authorize("admin"), seedWard);

// Medical Staff can admit/discharge
router.put("/:id/admit", authorize("doctor", "nurse", "admin"), admitPatient);
router.put(
	"/:id/discharge",
	authorize("doctor", "nurse", "admin"),
	dischargePatient
);

export default router;
