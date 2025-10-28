import { db } from "../Lib/db.js";
import { GenerateToken } from "../Lib/utils.js";
import bcrypt from "bcryptjs";

import { 
    userQuery__credantials, userQuery__table, userQuery__checkUser, userQuery__getUserID, userQuery__getUserByID, userQuery__editUsername } from "../Models/user.model.js";

export const signup = (req, res) => {
    const { username, email, password } = req.body;

    const hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    let hexColor = "#";

    function randomColorUtility(length) {
        return Math.floor(Math.random() * length);
    };

    for (let i = 0; i < 6; i++) {
        hexColor += hex[randomColorUtility(hex.length)]
    }

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt);

    const values = [
        username,
        email,
        req.body.password = hashedPassword,
        req.body.userIdColor = hexColor
    ];

    try {
        db.query(userQuery__table)
        db.query(userQuery__checkUser, (err, allUsers) => {
            if (err) return res.status(404).json("Error occured in 👉signup controller Queries" + " | Error " + err);

            const findEmail = allUsers.find(e => e.email.includes(email));

            if (!findEmail) {
                db.query(userQuery__credantials, [values]);
                db.query(userQuery__getUserID, email, (err, selectedUser) => {
                    if (err) return res.status(404).json("Error occured in 👉signup controller Queries" + " | Error " + err);

                    if (selectedUser.length !== 0) {
                        GenerateToken(selectedUser[0].id, res);

                        res.status(201).json({ user: selectedUser[0] })
                    }
                });
            } else {
                res.json({ message: "User already exists" })
            };
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
                } else {
                    return res.json({ message: "Invalid credentials" })
                };
            } else {
                return res.json({ message: "Invalid credentials" })
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

            res.status(202).json(authorizedUser[0])
        });

    } catch (error) {
        res.status(500).json("Error in 👉checkauth controller" + " | Error " + error.message);
        console.log("Error in 👉checkauth controller" + " | Error " + error.message);
    };
};

export const changeUsername = (req, res) => {
    try {
        const { username } = req.body;
        const id = req.user;
        console.log(req.user);

        db.query(userQuery__editUsername, [username, id], (err, user) => {
            if (err) return res.status(404).json("Error occured in 👉changeUsername controller Queries" + " | Error " + err);
            res.status(202).json({ user: "Updated successfully" })
        });

    } catch (error) {
        res.status(500).json("Error in 👉changeUsername controller" + " | Error " + error.message);
        console.log("Error in 👉changeUsername controller" + " | Error " + error.message);
    }
};

