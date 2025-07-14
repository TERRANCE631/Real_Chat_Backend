import e from "express";
import { checkauth, loggin, loggout, signup } from "../Controllers/auth.controller.js";
import { protectRoute } from "../Middlewares/auth.middleware.js";

const authRouter = e.Router();

authRouter.post("/signup", signup)
authRouter.post("/loggin", loggin)
authRouter.post("/loggout", loggout)
authRouter.get("/checkauth", protectRoute, checkauth)

export default authRouter;