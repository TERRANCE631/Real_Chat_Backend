import { db } from "../Lib/db.js";
import { getBothUsersMessages, messageQuery__createTable, messageQuery__getUsers, messageQuery__sendMessage } from "../Models/messages.model.js";

export const getUsers = (req, res) => {
    try {
        const currentUser = req.user

        db.query(messageQuery__getUsers, (err, users) => {
            if (err) return res.status(404).json("Error occured in 👉getUsers controller Queries" + " | Error " + err);

            const userlist = users.filter((user) => user.id !== currentUser);

            res.status(302).json({ user_list: userlist });
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

            res.status(302).json({ messages: messages[0] })
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
            message
        ];

        db.query(messageQuery__createTable);
        db.query(messageQuery__sendMessage, [values], (err, messages) => {
            if (err) return res.status(400).json("Error occured in 👉sendMessage controller Queries" + " | " + err)

            res.status(200).json({ message: "Message sent" });
        });

    } catch (error) {
        console.log("Error in 👉sendMessages controller" + " | Error: " + error.message);
        res.status(500).json("Error in 👉sendMessages controller" + " | Error: " + error.message)
    };
};

