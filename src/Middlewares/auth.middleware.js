import jwt from "jsonwebtoken";

export const protectRoute = (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log("Token from cookies:", token);

        if (!token) {
            return res.status(401).json("Unauthorized - No token found");
        }

        const decoded = jwt.verify(token, process.env.HIDDEN_VALUE);
        console.log("Decoded token:", decoded);

        if (!decoded || !decoded.userID) {
            return res.status(401).json("Unauthorized - Invalid token");
        }

        // ✅ Attach userID to req
        req.user = decoded.userID;

        // ✅ Must call next() to move on to the route
        next();

    } catch (error) {
        console.error("Error in auth middleware:", error.message);
        return res.status(500).json("Error in auth middleware: " + error.message);
    }
};
