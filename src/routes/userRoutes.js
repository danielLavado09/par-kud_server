import { Router } from "express";
import {
  updateUser,
  getUserReservations,
  deleteUser,
  createUser,
  usersByReservations,
  userByParkingId,
  monthlyUserReservations,
} from "../controllers/userController.js";

const router = Router();

router.post("/user/update/:identityCard", updateUser);
router.get("/user/reservations/:identityCard", getUserReservations);
router.post("/user/delete/:identityCard", deleteUser);
router.post("/user/create", createUser);
router.get("/user/users-by-reservations/:limit", usersByReservations);
router.get("/user/users-by-parking/:parkingId", userByParkingId);
router.get("/user/monthly-user-reservations", monthlyUserReservations)

export default router;
