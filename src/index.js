import express from "express";
import router from "./Routes/auth.router.js";
import dotenv from "dotenv";
import { connectdb } from "./Lib/db.js";

dotenv.config();
const PORT = process.env.PORT

// create an app
const app = express();
// json body parser
app.use(express.json());
// routes
app.use("/auth", router)

connectdb()
    .then(() =>
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT} 👍👍`)
        })
    ).catch(() => console.log(`db is not connected! 👎👎`))
