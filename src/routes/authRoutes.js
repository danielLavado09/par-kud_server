import { Router } from "express";
import { register, login } from "../controllers/authController.js";

const router = Router();

router.post("/user/register", (req, res) => register(req, res, "user"));
router.post("/user/login", (req, res) => login(req, res, "user"));

router.post("/employee/register", (req, res) => register(req, res, "employee"));
router.post("/employee/login", (req, res) => login(req, res, "employee"));

router.post("/admin/login", (req, res) => login(req, res, "admin"));

export default router;
