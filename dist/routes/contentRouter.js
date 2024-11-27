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
exports.contentRouter = void 0;
const express_1 = require("express");
// import { z }  from "zod"
const utils_1 = require("../utils");
const middleware_1 = require("../middleware");
const contentSchema_1 = require("../schema/contentSchema");
const linkSchema_1 = require("../schema/linkSchema");
const userSchema_1 = require("../schema/userSchema");
exports.contentRouter = (0, express_1.Router)();
// const addContentSchema = z.object({
//     link: z.string().url(),
//     type: z.enum(contentTypes),
//     title: z.string().min(1, "title is required"),
// })
exports.contentRouter.post("/create", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const link = req.body.link;
    const type = req.body.type;
    //@ts-ignore
    const userId = req.userId;
    yield contentSchema_1.Content.create({
        link,
        type,
        title: req.body.title,
        userId: userId,
        tags: [],
        suggestions: []
    });
    res.json({
        message: "Content added"
    });
}));
exports.contentRouter.get("/get", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.userId;
    const content = yield contentSchema_1.Content.find({
        userId: userId
    }).populate("userId", "username");
    res.json({
        content
    });
}));
exports.contentRouter.delete("/", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    yield contentSchema_1.Content.deleteMany({
        contentId,
        // @ts-ignore
        userId: req.userId
    });
    res.json({
        message: "Deleted"
    });
}));
exports.contentRouter.post("/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    if (share) {
        const existingLink = yield linkSchema_1.LinkModel.findOne({
            //@ts-ignore
            userId: req.userId
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
        }
        const hash = (0, utils_1.randoms)(10);
        yield linkSchema_1.LinkModel.create({
            // @ts-ignore
            userId: req.userId,
            hash: hash
        });
        res.json({
            hash
        });
    }
    else {
        yield linkSchema_1.LinkModel.deleteOne({
            // @ts-ignore
            userId: req.userId,
        });
        res.json({
            message: "Removed link"
        });
    }
}));
exports.contentRouter.get("/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield linkSchema_1.LinkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        });
        return;
    }
    //userID
    const content = yield contentSchema_1.Content.find({
        userId: link.userId
    });
    const user = yield userSchema_1.User.findOne({
        _id: link.userId
    });
    res.json({
        username: user === null || user === void 0 ? void 0 : user.username,
        content: content
    });
}));
