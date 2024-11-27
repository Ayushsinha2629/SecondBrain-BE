import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { userRouter } from './routes/userRouter';
import { contentRouter } from './routes/contentRouter';
import { adminRouter } from './routes/adminRouter';
import { moderatorRouter } from './routes/moderatorRouter';


const app = express()


app.use(express.json())
app.use(cors())
dotenv.config()
const mongoUri = process.env.MONGO_URI
if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in the environment variables");
  }
mongoose.connect(mongoUri);

app.use("/api/v1/user", userRouter)

app.use("/api/v1/content", contentRouter )

app.use("/api/v1/admin", adminRouter)

app.use("/api/v1/moderator", moderatorRouter)

app.listen(3000);