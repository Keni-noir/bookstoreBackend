import {Request, Response } from "express";
import { prisma } from "../config/db.js";

const getBoooks = async (req: Request, res: Response ) => {
    try{
        const books = await prisma.books.findMany();
        res.status(200).json({
            status: "SUCCESS",
            data: books
        })
    } catch (error){
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            status: "FAILED",
            message: `Failed to fetch books: ${message}`
        })
    }
}

const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const book = await prisma.books.findUnique({
      where: { id: Number(id) },
    });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.status(200).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch book" });
  }
};

const getBooksByUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const books = await prisma.books.findMany({
      where: { userId: userId },
    });

    return res.status(200).json({
      status: "SUCCESS",
      data: books
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "FAILED", error: "Failed to fetch books" });
  }
};

// Create book (authenticated user)
const createBook = async (req: Request, res: Response) => {
  const { title, author, publishedDate, price, description } = req.body;

  try {
    const book = await prisma.books.create({
      data: {
        title,
        author,
        publishedDate: new Date(publishedDate),
        price,
        description,
        userId: req.userId
      },
    });
    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create book" });
  }
};

// Update book (only owner)
const updateBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  const { title, author, publishedDate, price, description } = req.body;

  try {
    const existingBook = await prisma.books.findUnique({
      where: { id: Number(id) },
    });

    if (!existingBook)
      return res.status(404).json({ error: "Book not found" });

    if (existingBook.userId !== userId)
      return res.status(403).json({ error: "Not authorized" });

    const updatedBook = await prisma.books.update({
      where: { id: Number(id) },
      data: {
        title,
        author,
        publishedDate: new Date(publishedDate),
        price,
        description,
      },
    });

    res.json(updatedBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update book" });
  }
};
const deleteBook = async (req: Request, res: Response ) =>{
  const { id } = req.params;
  const userId = req.userId;
  try {
    const existingBook = await prisma.books.findUnique({
      where: { id: Number(id) },
    })
    if (!existingBook)
      return res.status(404).json({ error: "Book not found" });

    if (existingBook.userId !== userId)
      return res.status(403).json({ error: "Not authorized" });

    await prisma.books.delete({
      where: { id: Number(id) },
    })

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete book" });
  }
}

export { getBoooks, getBookById, getBooksByUser, createBook, updateBook, deleteBook};