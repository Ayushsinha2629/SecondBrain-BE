import { Router } from "express";
import { Request, Response } from 'express';
import { User } from "../schema/userSchema";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from 'jsonwebtoken';
import { JWT_PASSWORD } from "../config";


export const userRouter =  Router()

const signupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

const signinSchema = z.object({
    username: z.string(),
    password: z.string(),
});

async function userExists(username: string):Promise<boolean>{
    try{
        const user = await User.findOne({ username});
        return !!user
    }catch(err){
        console.log("Error checking if user exists");
        return false
    }
}

function determineRole(username: string): "admin" | "moderator" | "user" {
    if (username.startsWith("admin")) return "admin";
    if (username.startsWith("moderator")) return "moderator";
    return "user";
}

//@ts-ignore
userRouter.post("/signup", async (req, res) => {
    const {username, password} = signupSchema.parse(req.body);

    if (!username || !password) {
        return res.status(411).json({
          message: "Username and password are required",
        });
      }

    try{
        if(await userExists(username)) {
            return res.status(403).json({
                message: "User Already Exists"
            })
        }

        const role = determineRole(username);

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            password: hashedPassword,
            role,
        })

        return res.status(201).json({
            message: `User Signed Up as ${role}`,
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message: "Error Signing Up"
        })
    }
})
//@ts-ignore
userRouter.post("/signin", async (req: Request, res: Response) => {
    const {username, password} = signinSchema.parse(req.body);

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required",
        });
    }
     
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(403).json({
                message: "Incorrect Username or Password",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({
                message: "Incorrect Username or Password",
            });
        }

        const jwt_token = jwt.sign({ id: user._id, role: user.role }, JWT_PASSWORD);

        return res.status(200).json({
            token: jwt_token,
            role: user.role,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error Signing In",
        });
    }
});