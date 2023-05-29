import { Router } from "express";
import { createReservation, getReservationsByMonth, getTopParkingsByReservations } from "../controllers/reservationsController.js";

const router = Router();

router.post("/reservations/create", createReservation);
router.get("/reservations/reservations-by-month", getReservationsByMonth);
router.get('/reservations/top-parkings/:n', getTopParkingsByReservations);

export default router;
