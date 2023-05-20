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

export const getCities = async (req, res) => {
  try {
    const cities = await Parking.findAll({
      attributes: ["city"],
      group: ["city"],
      raw: true,
    });
    res.json(cities.map((parking) => parking.city));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las ciudades" });
  }
};

export const getParkingsByCity = async (req, res) => {
  const { city } = req.query;
  try {
    const parkings = await Parking.findAll({
      where: { city },
      attributes: ["parking_id", "name"],
      raw: true,
    });
    res.json(parkings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los parqueaderos" });
  }
};

export const getParkingById = async (req, res) => {
  const { parkingId } = req.params;
  try {
    const parking = await Parking.findByPk(parkingId);
    res.json(parking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los datos del parqueadero" });
  }
};
