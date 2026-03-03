import express from "express";
import {signUp, LogIn} from "../controllers/authController.js"

const router = express.Router();

router.post("/signUp", signUp)
router.post("/login", LogIn)
export default router;