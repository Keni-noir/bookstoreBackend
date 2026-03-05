import 'dotenv/config.js';
import express from "express";
import bookStoreRoute from "./routes/bookRoute.js"
import authRoute from "./routes/authRoutes.js"
import externalApiRoute from "./routes/externalApiRoute.js"
import { config } from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';
import cors from "cors";

config();


const app = express();
connectDB()
app.use(cors({
    origin: ["http://localhost:5173", "https://bookstore-frontend-amber.vercel.app/login"],

    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/books", bookStoreRoute)
app.use("/auth", authRoute)
app.use("/external", externalApiRoute)


const PORT = 5001;
const Server = app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

process.on("unhandledRejection", (err) => {
    console.error("unhandled Rejection", err);
    Server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});
process.on("uncaughtException", (err) => {
    console.error("uncaught Exception", err);
    Server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});
process.on("SIGTERM", (err) => {
    console.error("SIGTERM received, shutting down gracefully", err);
    Server.close(async () => {
        await disconnectDB();
        process.exit(1);
    })
})