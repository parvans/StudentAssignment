import express from "express";
import faculty from "../middleware/faculty.js";
import auth from "../middleware/auth.js";
import { newAssignment } from "../controllers/assignment-controller.js";
const router = express.Router();
router.get("/allassignments",[faculty,auth],newAssignment);
router.post("/newassignment",newAssignment);

export default router;