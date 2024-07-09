import express from "express";
import { singup } from "../controllers/auth.controller.js";
import { login } from "../controllers/auth.controller.js";
import { google } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", singup);
router.post("/login", login);
router.post("/google", google);

export default router;
