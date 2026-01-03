import express from "express";
import {
	createRecord,
	getpatientHistory,
	getAllRecords,
} from "../controllers/recordController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createRecord);

router.get("/all", getAllRecords);

router.route("/:patientId").get(getpatientHistory);

export default router;
