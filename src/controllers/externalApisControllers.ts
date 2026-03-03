import { Request, Response } from "express";
import { ExternalBookSearch } from "../services/externalApi.js";


const searchBooks = async (req: Request, res: Response) => {
    try {
        const search = req.query.q as string;
        if (!search || typeof search !== 'string') {
            return res.status(400).json({ error: "Missing or invalid search query" });
        }

        const books = await ExternalBookSearch(search);
        console.log("Search query:", search);
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: "Failed to search external books" });
    }

}

export { searchBooks };