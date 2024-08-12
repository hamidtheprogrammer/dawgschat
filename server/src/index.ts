import express from "express";
import cors from "cors";
import cookierParser from "cookie-parser";
import dotenv from "dotenv";
import testRouter from "./routes/testRoute";
import connectDb, { connectCloudinary } from "./database/dbConfig";
import userRouter from "./routes/userRoutes";
import messageRouter from "./routes/messageRoutes";
import { app, httpServer } from "./sockets/socket";
import groupRouter from "./routes/groupRoutes";
import path from "path";

type reqUser = {
  username: string;
  userId: string;
};

declare global {
  namespace Express {
    interface Request {
      user: reqUser;
    }
  }
}

dotenv.config();
connectDb();
connectCloudinary();

app.use(express.json());
app.use(cookierParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

const port = process.env.PORT || 3500;

app.use(testRouter);
app.use(userRouter);
app.use(messageRouter);
app.use(groupRouter);
app.use(express.static(path.join(__dirname, "../../client/dist")));

httpServer.listen(port, () => {
  console.log("server running on " + port);
});
