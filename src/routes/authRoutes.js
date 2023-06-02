import { Router } from "express";
import { register, login, updatePassword } from "../controllers/authController.js";

const router = Router();

router.post("/user/register", register);
router.post("/user/login", login);
router.post("/user/updatePassword/:identityCard", updatePassword)

export default router;
