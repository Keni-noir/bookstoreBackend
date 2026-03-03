import express from "express";
import { getBoooks, getBookById, createBook, getBooksByUser, updateBook, deleteBook } from "../controllers/booksControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { creatBookSchema, updateBookschema } from "../validators/Bookvalidator.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/getBooks", getBoooks);
router.get("/getBook/:id", getBookById);
router.get("/getBooksByUser", getBooksByUser);
router.post("/createBook", validate(creatBookSchema), createBook);
router.put("/updateBook/:id", validate(updateBookschema), updateBook);
router.delete("/deleteBook/:id", deleteBook);

export default router;