import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    process.env.DEV_API_URL,
    process.env.PROD_API_URL
];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

// Store online users
const userSocketMap = {};
export const getReceiverSocketID = (userID) => userSocketMap[userID];

io.on("connection", (socket) => {
    console.log("user connected | " + socket.id);
    const userID = socket.handshake.query.userID;
    if (userID) userSocketMap[userID] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        if (userID) delete userSocketMap[userID];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };
