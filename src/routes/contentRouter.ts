import { Router } from "express"
// import { z }  from "zod"
import { randoms } from "../utils";
import { userMiddleware } from "../middleware";
import { Content } from "../schema/contentSchema";
import { LinkModel } from "../schema/linkSchema";
import { User } from "../schema/userSchema";

export const contentRouter = Router()

// const addContentSchema = z.object({
//     link: z.string().url(),
//     type: z.enum(contentTypes),
//     title: z.string().min(1, "title is required"),

// })

contentRouter.post("/create", userMiddleware, async(req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    //@ts-ignore
    const userId = req.userId;
    await Content.create({
        link,
        type,
        title: req.body.title,
        userId: userId,
        tags: [],
        suggestions: []
    })

    res.json({
        message: "Content added"
    })
})

contentRouter.get("/get", userMiddleware, async(req, res) => {
   // @ts-ignore
   const userId = req.userId;
   const content = await Content.find({
       userId: userId
   }).populate("userId", "username")
   res.json({
       content
   })
})

contentRouter.delete("/", userMiddleware, async(req, res) =>{
    const contentId = req.body.contentId;

    await Content.deleteMany({
        contentId,
        // @ts-ignore
        userId: req.userId
    })

    res.json({
        message: "Deleted"
    })
})

contentRouter.post("/brain/share", userMiddleware, async(req, res) => {
    const share = req.body.share;
    if(share) {
        const existingLink = await LinkModel.findOne({
            //@ts-ignore
            userId: req.userId
        })
        if(existingLink) {
            res.json({
                hash: existingLink.hash
            })
        }
        const hash = randoms(10)
        await LinkModel.create({
        // @ts-ignore
            userId: req.userId,
            hash: hash
        })

        res.json({
            hash
        })
    } else {
       await LinkModel.deleteOne({
        // @ts-ignore
            userId: req.userId,

        });

        res.json({
            message: "Removed link"
        })
    }
})

contentRouter.get("/brain/:shareLink", async(req, res) => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    })

    if(!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }

    //userID
    const content = await Content.find({
        userId: link.userId
    })

    const user = await User.findOne({
        _id: link.userId
    })

    res.json({
        username: user?.username,
        content: content
    })
})