import express from "express";
import { profile } from "../controllers/user.controller.js";

const router = express.Router();

// router.get("/", test);
router.post("/upload", profile);

export default router;
