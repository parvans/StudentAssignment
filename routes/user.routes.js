import express from "express";
import { allStudents, userLogin, userRegister } from "../controllers/user-controller.js";
import faculty from "../middleware/faculty.js";
import auth from "../middleware/auth.js";
const router = express.Router();
router.post("/register",[faculty,auth],userRegister);
router.post("/login",userLogin);
router.get('/allstudents',[faculty,auth],allStudents);
export default router;