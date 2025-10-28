import { db } from "../Lib/db.js";
import { getReceiverSocketID, io } from "../Lib/socket.js";
import { getBothUsersMessages, messageQuery__createTable, messageQuery__getAllMessages, messageQuery__getUsers, messageQuery__sendMessage } from "../Models/messages.model.js";

export const getUsers = (req, res) => {
    try {
        const currentUser = req.user

        db.query(messageQuery__getUsers, (err, users) => {
            if (err) return res.status(404).json("Error occured in 👉getUsers controller Queries" + " | Error " + err);

            const userlist = users.filter((user) => user.id !== currentUser);

            res.json(userlist);
        });

    } catch (error) {
        res.status(500).json("Error in 👉getUsers controller" + " | Error " + error.message);

        console.log("Error in 👉getUsers controller" + " | Error " + error.message);
    };
};

export const getMessages = (req, res) => {
    try {
        const sender_ID = req.user;
        const { id: receiver_ID } = req.params;
        
        db.query(messageQuery__createTable);
        db.query(getBothUsersMessages(sender_ID, receiver_ID), (err, messages) => {
            if (err) return res.status(404).json("Error occured in 👉getMessages controller Queries" + " | " + err);

            res.json(messages)
        });

    } catch (error) {
        console.log("Error in 👉getMessages controller" + " | Error " + error.message);

        res.status(500).json("Error in 👉getMessages controller" + " | Error " + error.message);
    };
};

export const sendMessages = (req, res) => {
    try {
        const { message } = req.body;
        const sender_ID = req.user;
        const { id: receiver_ID } = req.params;

        const values = [
            sender_ID,
            receiver_ID,
            message,
            req.body.id = Math.floor(Math.random() * 1)
        ];
        console.log("sender_ID:", sender_ID, "receiver_ID:", receiver_ID, "message:", message);

        db.query(messageQuery__createTable);
        db.query(messageQuery__sendMessage, [values], (err, sendMessage) => {
            if (err) return res.status(400).json("Error occured in 👉sendMessage controller Queries" + " | " + err);

            db.query(messageQuery__getAllMessages, (err, message) => {
                if (err) return res.status(400).json("Error occured in 👉sendMessage controller on SentMessage Query" + " | " + err);

                const findSentMessage = message.find((text) => text.id === sendMessage.insertId)
                const receiverSocketID = getReceiverSocketID(receiver_ID);

                if (receiverSocketID) {
                    io.to(receiverSocketID).emit("newMessage", findSentMessage)
                };

                res.status(201).json(findSentMessage);
            })
        });

    } catch (error) {
        console.log("Error in 👉sendMessages controller" + " | Error: " + error.message);
        res.status(500).json("Error in 👉sendMessages controller" + " | Error: " + error.message)
    };
};

