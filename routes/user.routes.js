import express from "express";
import { userLogin, userRegister } from "../controllers/user-controller.js";
import faculty from "../middleware/faculty.js";
import auth from "../middleware/auth.js";
const router = express.Router();
router.post("/register",[faculty,auth],userRegister);
router.post("/login",userLogin);

export default router;