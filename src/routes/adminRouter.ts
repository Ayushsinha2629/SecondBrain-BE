import { Router } from "express";
import { User } from "../schema/userSchema";
import { Content } from "../schema/contentSchema";
import { userMiddleware } from "../middleware";

export const adminRouter = Router();

adminRouter.use(userMiddleware);

//@ts-ignore
adminRouter.patch("/users/update-role", async (req, res) => {

    //@ts-ignore
    const fetchedRole = req.role;
    if(fetchedRole == "admin"){
        return res.status(411).json({
            message: "Acess Denied, Admins only"
        })
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
        const user = await User.findOne({
            username: username
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            message: `User role updated to ${role}.`,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error updating user role.",
        });
        console.log(err)
    }
});

//@ts-ignore
adminRouter.get("/content", async (req, res) => {

    //@ts-ignore
    const fetchedRole = req.role;
    if(fetchedRole == "user"){
         return res.status(411).json({
             message: "Acess Denied, Admins and moderators only"
         })
    }

    try {
        const content = await Content.find({})
            .populate<{ userId: { username: string } }>("userId", "username")
            .lean();

        res.status(200).json({
            content: content.map(item => ({
                id: item._id,
                link: item.link,
                type: item.type,
                title: item.title,
                tags: item.tags,
                username: item.userId?.username || "Unknown",
                suggestions: item.suggestions || [],
            })),
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching content.",
        });
    }
});