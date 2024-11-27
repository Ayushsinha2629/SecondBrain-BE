import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { JWT_PASSWORD } from "./config";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string, JWT_PASSWORD) as { id: string, role: string };
    if (decoded) {
        //@ts-ignore
        req.userId = decoded.id;
        //@ts-ignore
        req.role = decoded.role
        next()
    } else {
        res.status(403).json({
            message: "You are not logged in"
        })
    }
}