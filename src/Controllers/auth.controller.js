import { db } from "../Lib/db.js";
import { GenerateToken } from "../Lib/utils.js";
import { userQuery__credantials, userQuery__table, userQuery__checkUser, userQuery__getUserID } from "../Models/user.model.js";

export const signup = (req, res) => {
    const { username, email, password } = req.body;
    const values = [username, email, password];

    db.query(userQuery__table)
    db.query(userQuery__checkUser, (err, data) => {
        const findEmail = data.find(e => e.email.includes(email));

        if (!findEmail) {
            db.query(userQuery__credantials, [values])

            db.query(userQuery__getUserID, email, () => {
                if (data.length > 0) {
                    res.json({ testing: data[0].id })
                }
            })
        } else {
            res.json({ message: "User already exist" })
        }
    })
};

export const loggin = (req, res) => {
    res.json({ text: "Logging in..." })
};
export const loggout = (req, res) => {
    res.json({ text: "Logging out..." })
}; 