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
        const sender_ID = req.user;           // authenticated user
        const receiver_ID = String(req.params.id); // normalize to string

        if (!message || !receiver_ID) {
            return res.status(400).json("Message or receiver ID missing");
        }

        const values = [sender_ID, receiver_ID, message];

        // Insert message into DB
        db.query(messageQuery__sendMessage, values, (err, result) => {
            if (err) return res.status(400).json("Error sending message | " + err);

            // Fetch the newly inserted message by insertId
            db.query(
                "SELECT * FROM messages WHERE id = ?",
                [result.insertId],
                (err, rows) => {
                    if (err) return res.status(400).json("Error fetching message | " + err);

                    const sentMessage = rows[0];

                    // Emit via Socket.IO if receiver is online
                    const receiverSocketID = getReceiverSocketID(receiver_ID);
                    if (receiverSocketID) {
                        io.to(receiverSocketID).emit("newMessage", sentMessage);
                    }

                    // Respond to sender
                    res.status(201).json(sentMessage);
                }
            );
        });
    } catch (error) {
        console.log("Error in sendMessages | " + error.message);
        res.status(500).json("Error in sendMessages | " + error.message);
    }
};


