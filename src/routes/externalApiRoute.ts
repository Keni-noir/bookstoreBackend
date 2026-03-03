import express from "express";
import { searchBooks } from "../controllers/externalApisControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/searchBooks", authMiddleware, searchBooks);

export default router;