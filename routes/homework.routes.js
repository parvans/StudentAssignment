import express from "express";
import faculty from "../middleware/faculty.js";
import auth from "../middleware/auth.js";
import { attentAssignment, getAStudentHomeWork, getAllHomeWork, getAllStuPdf, getStuAttHomeWork, getStuPertiAttHomeWork } from "../controllers/homework-controller.js";
const router = express.Router();
router.post("/getq/:id",auth,attentAssignment);
router.get("/getallstuass",[faculty,auth],getAllHomeWork);
router.get("/getastuass/:id",[faculty,auth],getAStudentHomeWork);
router.get("/getastuattass",auth,getStuAttHomeWork)
router.get("/getastupertiattass/:id",auth,getStuPertiAttHomeWork)

router.get("/genallspdf",[faculty,auth],getAllStuPdf);
export default router;