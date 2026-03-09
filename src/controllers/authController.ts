import {prisma} from "../config/db.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../utils/token.js";
import {Request, Response} from "express";


const signUp = async (req: Request, res: Response) =>{
    const {username,email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
        where: {email: email}, 
    });
    if (existingUser) {
            return res.status(404).json({message:"User already exist with this email"})
        }
    const normalizedUsername = username.toLowerCase();
    const existingUserName = await prisma.user.findUnique({
        where: {username: normalizedUsername},
    })
    if (existingUserName) {
        return res.status(400).json({message:"User already exist with this username"})
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
        data:{
            username,
            email,
            password: hashedPassword,
        }
    });
    
    const token = generateToken(user.id, res)

    res.status(201).json({
        status:"SUCCESS",
        data: {
            token,
            user: {
                id: user.id,
                username: username,
                email: email
            }
        }
    })
};

const LogIn = async (req: Request, res: Response) => {
    const {username, password} = req.body;

    const User = await prisma.user.findUnique({
        where: {username: username}
    });
    if (!User){
        return res.status(404).json({message:"Invalid username or password"})
    }

    const isvalidpassword = await bcrypt.compare(password, User.password);

    if (!isvalidpassword) {
        return res
        .status(400)
        .json({message: "Invalid username or password"});
    }

    const token = generateToken(User.id, res)

    res.status(201).json({
        status:"SUCCESS", 
        data: {
            token,
            User: {
            id: User.id,
            username: username,
        }
        
    },
});
}

export {signUp, LogIn};