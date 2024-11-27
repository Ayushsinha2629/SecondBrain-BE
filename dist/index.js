"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRouter_1 = require("./routes/userRouter");
const contentRouter_1 = require("./routes/contentRouter");
const adminRouter_1 = require("./routes/adminRouter");
const moderatorRouter_1 = require("./routes/moderatorRouter");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
dotenv_1.default.config();
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in the environment variables");
}
mongoose_1.default.connect(mongoUri);
app.use("/api/v1/user", userRouter_1.userRouter);
app.use("/api/v1/content", contentRouter_1.contentRouter);
app.use("/api/v1/admin", adminRouter_1.adminRouter);
app.use("/api/v1/moderator", moderatorRouter_1.moderatorRouter);
app.listen(3000);
