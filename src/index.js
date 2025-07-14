import express from "express";
import dotenv from "dotenv";
import { connectdb } from "./Lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./Routes/auth.router.js";
import messagesRouter from "./Routes/messages.router.js";

dotenv.config();
const PORT = process.env.PORT
const app = express();

// opening middleware section
app.use(cors({
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/messages", messagesRouter);
// closing middleware section

// connecting database and running server after database is connected
connectdb()
    .then(() =>
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT} 👍👍`)
        })
    ).catch((error) => console.log(`db is not connected! 👎👎, ${error}`))
