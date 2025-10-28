import { Server } from "socket.io";
import http from "http";
import e from "express";

const app = e();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});

// Used to store online users
const userSocketMap = {}; // { userID: socket.id }
export const getReceiverSocketID = (userID) => {
    return userSocketMap[userID]; 
}

io.on("connection", (socket) => {
    console.log("user connected" + " | " + socket.id)

    const userID = socket.handshake.query.userID;
    if (userID) userSocketMap[userID] = socket.id;

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected" + " | " + socket.id)
        delete userSocketMap[userID];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };