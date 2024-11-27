"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = void 0;
const mongoose_1 = require("mongoose");
const contentTypes = ['twitter', 'youtube', 'document', 'link'];
const contentSchema = new mongoose_1.Schema({
    link: { type: String },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String },
    tags: [{ type: mongoose_1.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true },
    suggestions: [
        {
            suggestion: { type: String, required: true },
            date: { type: Date, required: true },
        },
    ],
});
exports.Content = (0, mongoose_1.model)("Content", contentSchema);
