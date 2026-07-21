import { Router } from "express";
import { register, login, profile, logout, updateProfile } from "../controllers/auth.controller"
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadAvatar } from "../middleware/upload.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);
router.put("/profile", authMiddleware, uploadAvatar.single("avatar"), updateProfile);
router.post("/logout", logout);

export default router;