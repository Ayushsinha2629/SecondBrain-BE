"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const userSchema_1 = require("../schema/userSchema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
exports.userRouter = (0, express_1.Router)();
const signupSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "Username must be at least 3 characters long"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
const signinSchema = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string(),
});
function userExists(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield userSchema_1.User.findOne({ username });
            return !!user;
        }
        catch (err) {
            console.log("Error checking if user exists");
            return false;
        }
    });
}
function determineRole(username) {
    if (username.startsWith("admin"))
        return "admin";
    if (username.startsWith("moderator"))
        return "moderator";
    return "user";
}
//@ts-ignore
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = signupSchema.parse(req.body);
    if (!username || !password) {
        return res.status(411).json({
            message: "Username and password are required",
        });
    }
    try {
        if (yield userExists(username)) {
            return res.status(403).json({
                message: "User Already Exists"
            });
        }
        const role = determineRole(username);
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield userSchema_1.User.create({
            username,
            password: hashedPassword,
            role,
        });
        return res.status(201).json({
            message: `User Signed Up as ${role}`,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Error Signing Up"
        });
    }
}));
//@ts-ignore
exports.userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = signinSchema.parse(req.body);
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required",
        });
    }
    try {
        const user = yield userSchema_1.User.findOne({ username });
        if (!user) {
            return res.status(403).json({
                message: "Incorrect Username or Password",
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({
                message: "Incorrect Username or Password",
            });
        }
        const jwt_token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, config_1.JWT_PASSWORD);
        return res.status(200).json({
            token: jwt_token,
            role: user.role,
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Error Signing In",
        });
    }
}));
