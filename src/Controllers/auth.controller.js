import { db } from "../Lib/db.js";
import { GenerateToken } from "../Lib/utils.js";
import bcrypt from "bcryptjs";

import { userQuery__credantials, userQuery__table, userQuery__checkUser, userQuery__getUserID } from "../Models/user.model.js";

export const signup = (req, res) => {
    const { username, email, password } = req.body;

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt);

    const values = [
        username,
        email,
        req.body.password = hashedPassword
    ];

    try {
        db.query(userQuery__table)
        db.query(userQuery__checkUser, (err, allUsers) => {
            const findEmail = allUsers.find(e => e.email.includes(email));

            if (!findEmail) {
                db.query(userQuery__credantials, [values])
            } else {
                res.status(400).json({ message: "User already exist" });
            };

            if (allUsers.length > 0) return
            db.query(userQuery__getUserID, email, (err, selectedUser) => {
                if (selectedUser.length > 0) {
                    GenerateToken(selectedUser[0].id, res)
                    res.status(201).json({ user: selectedUser[0] })
                }
            });
        });
    } catch (error) {
        res.status(500).json("Error in signup controller", error.message);
    }

};

export const loggin = (req, res) => {
    const { email, password } = req.body;

    try {
        db.query(userQuery__getUserID, email, (err, user) => {
            if (user.length > 0) {
                const isPasswordCorrect = bcrypt.compareSync(password, user[0].password);
                if (isPasswordCorrect) {
                    GenerateToken(user[0].id, res);
                    res.status(200).json({ user: user[0] });
                } else {
                    return res.status(400).json("Invalid credentials")
                };
            } else {
                return res.status(400).json("Invalid credentials")
            };
        });
    } catch (error) {
        res.status(500).json("Error in loggin controller", error.message);
    };
};

export const loggout = (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 })
        res.status(200).json("You have successfully logged out")
    } catch (error) {
        res.status(500).json("Error in loggin controller", error.message);
    };
};
