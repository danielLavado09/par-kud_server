import { Router } from "express";
import { createReservation } from "../controllers/reservationController.js";

const router = Router();

router.post("/reservation/create", createReservation)

export default router;