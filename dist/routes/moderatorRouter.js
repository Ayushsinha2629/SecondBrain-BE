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
exports.moderatorRouter = void 0;
const express_1 = require("express");
const contentSchema_1 = require("../schema/contentSchema");
const middleware_1 = require("../middleware");
exports.moderatorRouter = (0, express_1.Router)();
exports.moderatorRouter.use(middleware_1.userMiddleware);
// @ts-ignore
exports.moderatorRouter.post("/content/suggest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const fetchedRole = req.role;
    if (fetchedRole !== "moderator") {
        return res.status(411).json({
            message: "Acess Denied, Moderators only"
        });
    }
    const { contentId, suggestion } = req.body;
    if (!contentId || !suggestion) {
        return res.status(400).json({
            message: "Content ID and suggestion are required.",
        });
    }
    try {
        const content = yield contentSchema_1.Content.findById(contentId);
        if (!content) {
            return res.status(404).json({
                message: "Content not found.",
            });
        }
        if (!content.suggestions) {
            content.suggestions = [];
        }
        content.suggestions.push({
            suggestion,
            date: new Date(),
        });
        yield content.save();
        res.status(200).json({
            message: "Suggestion added successfully.",
            content,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Error suggesting edits.",
        });
    }
}));
