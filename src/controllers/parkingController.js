import { Parking } from "../models/Parking.js";

export const createParking = async (req, res) => {
  try {
    const {
      name,
      city,
      address,
      slots,
      sedan_hourly_rate,
      suv_hourly_rate,
      motorcycle_hourly_rate,
      opening_time,
      closing_time,
      is_covered,
    } = req.body;

    const image = req.file;

    const parking = await Parking.create({
      name,
      city,
      address,
      slots,
      sedan_hourly_rate,
      suv_hourly_rate,
      motorcycle_hourly_rate,
      opening_time,
      closing_time,
      img_url: image ? image.filename : null,
      is_covered,
    });

    res.status(201).json({
      message: "Parqueadero registrado exitosamente",
      parking: parking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar el parqueadero" });
  }
};
