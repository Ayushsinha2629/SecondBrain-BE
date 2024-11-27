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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const userSchema_1 = require("../schema/userSchema");
const contentSchema_1 = require("../schema/contentSchema");
const middleware_1 = require("../middleware");
exports.adminRouter = (0, express_1.Router)();
exports.adminRouter.use(middleware_1.userMiddleware);
//@ts-ignore
exports.adminRouter.patch("/users/update-role", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const fetchedRole = req.role;
    if (fetchedRole !== "admin") {
        return res.status(411).json({
            message: "Acess Denied, Admins only"
        });
    }
    const { username, role } = req.body;
    if (!username || !role) {
        return res.status(400).json({
            message: "Username and role are required.",
        });
    }
    const validRoles = ["admin", "moderator", "user"];
    if (!validRoles.includes(role)) {
        return res.status(400).json({
            message: "Invalid role provided.",
        });
    }
    try {
        const user = yield userSchema_1.User.findOne({
            username: username
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }
        user.role = role;
        yield user.save();
        res.status(200).json({
            message: `User role updated to ${role}.`,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error updating user role.",
        });
        console.log(err);
    }
}));
//@ts-ignore
exports.adminRouter.get("/content", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const fetchedRole = req.role;
    if (fetchedRole == "user") {
        return res.status(411).json({
            message: "Acess Denied, Admins and moderators only"
        });
    }
    try {
        const content = yield contentSchema_1.Content.find({})
            .populate("userId", "username")
            .lean();
        res.status(200).json({
            content: content.map(item => {
                var _a;
                return ({
                    id: item._id,
                    link: item.link,
                    type: item.type,
                    title: item.title,
                    tags: item.tags,
                    username: ((_a = item.userId) === null || _a === void 0 ? void 0 : _a.username) || "Unknown",
                    suggestions: item.suggestions || [],
                });
            }),
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error fetching content.",
        });
    }
}));
exports.adminRouter.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userSchema_1.User.find({}, "username role").lean(); // Fetch only username and role fields
        res.status(200).json({ users });
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching users." });
    }
}));
