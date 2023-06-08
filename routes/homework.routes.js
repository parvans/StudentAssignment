import express from "express";
import faculty from "../middleware/faculty.js";
import auth from "../middleware/auth.js";
import { attentAssignment, getAllHomeWork } from "../controllers/homework-controller.js";
const router = express.Router();
router.post("/getq/:id",[auth],attentAssignment);
router.get("/getallstuass",getAllHomeWork);

export default router;