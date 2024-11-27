import {model, Schema} from "mongoose";

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "moderator", "user"] },
  });

export const User = model("User", userSchema);