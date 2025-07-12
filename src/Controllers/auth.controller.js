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

    db.query(userQuery__table)
    db.query(userQuery__checkUser, (err, allUsers) => {
        const findEmail = allUsers.find(e => e.email.includes(email));

        if (!findEmail) {
            db.query(userQuery__credantials, [values])
        } else {
            res.json({ message: "User already exist" });
        };

        if (allUsers.length > 0) return
        db.query(userQuery__getUserID, email, (err, selectedUser) => {
            if (selectedUser.length > 0) {
                GenerateToken(selectedUser[0].id, res)
                res.json({ user: selectedUser[0] })
            }
        });
    });
};

export const loggin = (req, res) => {
    const { email, password } = req.body;

    db.query(userQuery__getUserID, email, (err, user) => {
        const isPasswordCorrect = bcrypt.compareSync(password, user[0].password);
        if (isPasswordCorrect) {
            GenerateToken(user[0].id, res);
            res.json({ user: user[0] });
        } else {
            return res.status(400).json("Invalid credentials")
        };
    });
};

export const loggout = (req, res) => {
    res.json({ text: "Logging out..." })
}; 