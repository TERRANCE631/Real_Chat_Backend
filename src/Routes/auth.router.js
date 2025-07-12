import e from "express";
import { loggin, loggout, signup } from "../Controllers/auth.controller.js";

const router = e.Router();

router.post("/signup", signup)
router.post("/loggin", loggin)
router.get("/loggout", loggout)

export default router;