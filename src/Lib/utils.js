import jwt from "jsonwebtoken";

export const GenerateToken = (userID, res) => {
    const token = jwt.sign({ userID }, process.env.HIDDEN_VALUE, {
        expiresIn: "7d"
    });

    res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: "strict",
        // secure: process.env.NODE_ENV !== "develpment"
    });

    return token;
};