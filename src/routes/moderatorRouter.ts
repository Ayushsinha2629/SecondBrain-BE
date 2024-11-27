import { Router } from "express";
import { Content } from "../schema/contentSchema";
import { userMiddleware } from "../middleware";

export const moderatorRouter = Router();

moderatorRouter.use(userMiddleware)

// @ts-ignore
moderatorRouter.post("/content/suggest", async (req, res) => {
    //@ts-ignore
    const fetchedRole = req.role;
    if(fetchedRole !== "moderator"){
        return res.status(411).json({
            message: "Acess Denied, Moderators only"
        })
    }
    const { contentId, suggestion } = req.body;


    if (!contentId || !suggestion) {
        return res.status(400).json({
            message: "Content ID and suggestion are required.",
        });
    }

    try {
        const content = await Content.findById(contentId);

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

        await content.save();

        res.status(200).json({
            message: "Suggestion added successfully.",
            content,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error suggesting edits.",
        });
    }
});