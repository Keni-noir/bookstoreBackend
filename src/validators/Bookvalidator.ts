import { z } from "zod";

const creatBookSchema = z.object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    price: z
    .number({
      error: "Price must be a number",
    })
    .positive("Price must be a positive number"),
    publishedDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
    description: z.string().optional()
});

const updateBookschema = z.object({
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author is required"),
    price: z
    .number({
      error: "Price must be a number",
    })
    .positive("Price must be a positive number").optional(),
    publishedDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }).optional(),
    description: z.string().optional()
})

export { creatBookSchema, updateBookschema };