import { Router } from "express";
import multer from "multer";
import path from "path";
import { createParking, getCities, getParkingsByCity, getParkingById } from "../controllers/parkingController.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.post("/create-parking", upload.single("image"), createParking);
router.get("/get-cities", getCities);
router.get("/parkings", getParkingsByCity);
router.get("/parking/:parkingId", getParkingById);

export default router;
