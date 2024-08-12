import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Ensure this matches your frontend URL
    methods: ["GET", "POST"],
  },
});

const onlineUsers: any = {};

io.on("connection", (socket) => {
  console.log("A user connected with socket ID:", socket.id);
  const userId = socket.handshake.query.userId as string;

  if (userId) onlineUsers[userId] = socket.id;

  io.emit("get-onlineUsers", Object.keys(onlineUsers));

  socket.on("join-room", (rooms: string | string[]) => {
    socket.join(rooms);

    if (Array.isArray(rooms)) {
      rooms.forEach((room) => {
        console.log(userId + " joined room " + room);
      });
    }
  });

  socket.on("send-message", (message) => {
    socket.to(message.receiverId).emit("receive-message", message.content);
  });

  socket.on("leave-room", (rooms) => {
    socket.leave(rooms);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected with socket ID:", socket.id);
  });
});

export { io, httpServer, app };
