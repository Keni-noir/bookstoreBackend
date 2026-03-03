import jwt from "jsonwebtoken"
import { Response } from "express";

export const generateToken = (userId: number, res: Response) => {
    const payload = {id: userId};
    const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRE || "7d" } as any
    );

    res.cookie("jwt", token, {
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        maxAge: (1000 * 60 * 60 * 24) * 7
    })

    return token;

}