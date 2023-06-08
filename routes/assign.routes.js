import express from "express";
import faculty from "../middleware/faculty.js";
import auth from "../middleware/auth.js";
import {allAssigns,newAssignment } from "../controllers/assignment-controller.js";
const router = express.Router();
router.get("/allassignments",auth,allAssigns);
router.get("/getapassgnment/:id",auth,allAssigns);
router.post("/newassignment",[faculty,auth],newAssignment);

export default router;