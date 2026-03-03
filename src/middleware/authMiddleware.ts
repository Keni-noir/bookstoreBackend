import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { Request, Response, NextFunction } from "express";

interface DecodedToken {
    id: number;
    [key: string]: any;
}

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Auth Middleware reached");
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        req.userId = payload.id;
        const user = await prisma.user.findUnique({
            where: { id: payload.id },
        });

        if (!user) {
            return res
                .status(401)
                .json({ error: "user no longer exist" });
        }

        next();

    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
}