import express from "express";
import { verifyToken } from "../utills/verifyUser.js";
import { updateUser } from "../controllers/user.controller.js";
import { deleteUser } from "../controllers/user.controller.js";
import { logout } from "../controllers/user.controller.js";

const router = express.Router();

// router.get("/", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/logout", logout);

export default router;
