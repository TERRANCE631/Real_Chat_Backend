import jwt from "jsonwebtoken";

export const GenerateToken = (userID, res) => {
    const secret = process.env.HIDDEN_VALUE;
    if (!secret) {
        throw new Error("JWT secret is not defined. Please set HIDDEN_VALUE in your .env");
    }

    const token = jwt.sign({ userID }, secret, { expiresIn: "7d" });

    res.cookie("token", token, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        sameSite: "none", // must be "none" for cross-site requests
        secure: true      // must be true on HTTPS (Render & Netlify are HTTPS)
        // secure: process.env.NODE_ENV === "production",
    });

    return token;
};
