import jwt from "jsonwebtoken";

export const GenerateToken = (userID, res) => {
    const secret = process.env.HIDDEN_VALUE;
    if (!secret) {
        throw new Error("JWT secret is not defined in .env");
    }

    // Sign token
    const token = jwt.sign({ userID }, secret, { expiresIn: "7d" });

    // production cookie if needed in future like cross site
    // res.cookie("token", token, {
    //     httpOnly: true,
    //     sameSite: "none", // must be none on production 
    //     secure: true, // must be true on production
    //     maxAge: 1000 * 60 * 60 * 24 * 7
    // });

    // development cookie
    // res.cookie("token", token, {
    //     httpOnly: true,
    //     sameSite: "lax", // must be none on localhost
    //     secure: false, // must be false on localhost
    //     maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Server-side debug
    console.log("✅ Token generated:", token);

    return token;
};
