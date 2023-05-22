import { Reservation } from "../models/Reservation.js";

export const createReservation = async (req, res) => {
  try {
    const { identityCard, parkingId } = req.body;

    // Generar el reservationId utilizando identityCard, parkingId y la fecha y hora actual
    const reservationId = `${identityCard}${parkingId}${Date.now()}`;

    // Crear la reserva en la base de datos
    const reservation = await Reservation.create({
      reservationId,
      identityCard,
      parkingId,
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la reserva" });
  }
};
