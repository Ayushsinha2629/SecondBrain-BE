import { model, Schema, Types } from "mongoose";
import { User } from "./userSchema";

const contentTypes = ['twitter', 'youtube', 'document', 'link'];

const contentSchema = new Schema({
  link: { type: String },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String },
  tags: [{ type: Types.ObjectId, ref: 'Tag' }],
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  suggestions: [
    {
        suggestion: { type: String, required: true },
        date: { type: Date, required: true },
    },
  ],
});

export const Content = model("Content", contentSchema)