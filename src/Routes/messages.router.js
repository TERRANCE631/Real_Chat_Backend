import e from "express";
import { protectRoute } from "../Middlewares/auth.middleware.js";
import { messages } from "../Controllers/messages.controller.js";

const messagesRouter = e.Router();

messagesRouter.get("/users", protectRoute, messages)

export default messagesRouter;