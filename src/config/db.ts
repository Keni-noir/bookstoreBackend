import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";



const connectionString = process.env.DATABASE_URL;

// 2. Instantiate the pg driver
const pool = new Pool({ connectionString });

// 3. Instantiate the Prisma Client with the pg adapter
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

const connectDB = async () => {
    
    try {
        await prisma.$connect()
        console.log("Database connected successfully")
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Database connection failed: ${message}`)
        process.exit(1);
    }
}
const disconnectDB = async () => {
    await prisma.$disconnect();
}

export { prisma, connectDB, disconnectDB };