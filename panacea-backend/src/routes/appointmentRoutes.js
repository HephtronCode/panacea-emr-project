import express from "express";
import {
	bookAppointment,
	getAppointments,
	updateAppointment,
} from "../controllers/appointmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getAppointments).post(bookAppointment);

router.route("/:id").put(updateAppointment);

export default router;
