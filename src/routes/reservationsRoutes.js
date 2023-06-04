import { Router } from "express";
import {
  createReservation,
  getReservationsByMonth,
  getTopParkingsByReservations,
  updateReservationStatus,
  pendingReservationByUser,
} from "../controllers/reservationsController.js";

const router = Router();

router.post("/reservations/create", createReservation);
router.get("/reservations/reservations-by-month", getReservationsByMonth);
router.get("/reservations/top-parkings/:n", getTopParkingsByReservations);
router.put(
  "/reservations/updateStatus/:reservationId",
  updateReservationStatus
);
router.get(
  "/reservations/user-pending-reservations/:identityCard",
  pendingReservationByUser
);

export default router;
