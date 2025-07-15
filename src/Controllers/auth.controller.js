import { db } from "../Lib/db.js";
import { GenerateToken } from "../Lib/utils.js";
import bcrypt from "bcryptjs";

import { userQuery__credantials, userQuery__table, userQuery__checkUser, userQuery__getUserID, userQuery__getUserByID } from "../Models/user.model.js";

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
            if (err) return res.status(404).json("Error occured in 👉signup controller Queries" + " | Error " + err);

            const findEmail = allUsers.find(e => e.email.includes(email));

            if (!findEmail) {
                db.query(userQuery__credantials, [values])
            }

            if (allUsers.length > 0) {
                db.query(userQuery__getUserID, email, (err, selectedUser) => {
                    if (selectedUser.length > 0) {
                        GenerateToken(selectedUser[0].id, res);

                        res.status(201).json({ user: selectedUser[0], message: "You have successfully signed up" })
                    }
                });
            }
        });

    } catch (error) {
        res.status(500).json("Error in 👉signup controller" + " | Error " + error.message);
        console.log("Error in 👉signup controller" + " | Error " + error.message);
    };
};

export const loggin = (req, res) => {
    const { email, password } = req.body;

    try {
        db.query(userQuery__getUserID, email, (err, user) => {
            if (err) return res.status(404).json("Error occured in 👉loggin controller Queries" + " | Error " + err);

            if (user.length > 0) {
                const isPasswordCorrect = bcrypt.compareSync(password, user[0].password);
                if (isPasswordCorrect) {
                    GenerateToken(user[0].id, res);
                    res.status(201).json({ user: user[0] });

                    res.status(201).json({ message: "You have successfully signed up" });
                } else {
                    return res.status(400).json({ message: "Invalid credentials" })
                };
            } else {
                return res.status(404).json({ message: "Invalid credentials" })
            };
        });

    } catch (error) {
        res.status(500).json("Error in 👉loggin controller" + " | Error " + error.message);
        console.log("Error in 👉loggin controller" + " | Error " + error.message);
    };
};

export const loggout = (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 })
        res.status(200).json({ message: "You have successfully logged out" });

    } catch (error) {
        res.status(500).json("Error in 👉loggout controller" + " | Error " + error.message);
    };
};

export const checkauth = (req, res) => {
    try {
        db.query(userQuery__getUserByID, [req.user], (err, authorizedUser) => {
            if (err) return res.status(404).json("Error occured in 👉checkauth controller Queries" + " | Error " + err);

            res.status(202).json({ user: authorizedUser[0] })
        });

    } catch (error) {
        res.status(500).json("Error in 👉checkauth controller" + " | Error " + error.message);
        console.log("Error in 👉checkauth controller" + " | Error " + error.message);
    };
};

