import e from "express";
import { protectRoute } from "../Middlewares/auth.middleware.js";
import { getMessages, getUsers, sendMessages } from "../Controllers/messages.controller.js";

const messagesRouter = e.Router();

messagesRouter.get("/users", protectRoute, getUsers);
messagesRouter.get("/:id", protectRoute, getMessages);
messagesRouter.post("/send/:id", protectRoute, sendMessages);

export default messagesRouter;
