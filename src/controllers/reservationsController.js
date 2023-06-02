import { Reservations } from "../models/Reservations.js";
import { Parking } from "../models/Parking.js";
import { User } from "../models/User.js";
import { Op } from "sequelize";
import { sequelize } from "../database/database.js";

export const createReservation = async (req, res) => {
  try {
    const { identityCard, parkingId } = req.body;

    // Generar el reservationId utilizando identityCard, parkingId y la fecha y hora actual
    const reservationId = `${identityCard}${parkingId}${Date.now()}`;

    // Crear la reserva en la base de datos
    const reservation = await Reservations.create({
      reservationId,
      identityCard,
      parkingId,
    });

    // Incrementar el atributo bookings del usuario en 1
    await User.increment("bookings", {
      where: { identityCard },
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la reserva" });
  }
};

export const getReservationsByMonth = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const reservations = await Reservations.findAll({
      where: {
        createdAt: {
          [Op.between]: [
            new Date(`${currentYear}-01-01`),
            new Date(`${currentYear}-12-31`),
          ],
        },
      },
    });

    const reservationsByMonth = [];
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    for (let i = 0; i < monthNames.length; i++) {
      const monthCount = {
        month: monthNames[i],
        count: 0,
      };
      reservationsByMonth.push(monthCount);
    }

    reservations.forEach((reservation) => {
      const month = reservation.createdAt.getMonth();
      reservationsByMonth[month].count++;
    });

    res.json({ reservations: reservationsByMonth });
  } catch (error) {
    console.error("Error al obtener las reservas por mes:", error);
    res.status(500).json({ message: "Error al obtener las reservas por mes" });
  }
};

export const getTopParkingsByReservations = async (req, res) => {
  const { n } = req.params;

  try {
    const topParkingReservations = await sequelize.query(
      `
      SELECT "Parking"."city", "Parking"."name", COUNT("Reservations"."parkingId") AS "reservationCount"
      FROM "Parkings" AS "Parking"
      LEFT OUTER JOIN "Reservations" AS "Reservations" ON "Parking"."parkingId" = "Reservations"."parkingId"
      GROUP BY "Parking"."parkingId"
      ORDER BY "reservationCount" DESC
      LIMIT ${n};
      `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const parkings = {
      parkings: topParkingReservations,
    };

    res.json(parkings);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener el top de parqueaderos." });
  }
};

export const updateReservationStatus = async (req, res) => {
  const { reservationId } = req.params;
  const { status, startTime, endTime } = req.body;
  try {
    const reservation = await Reservations.findByPk(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }
    await reservation.update({
      status: status,
      startTime: startTime,
      endTime: endTime,
    });
    await reservation.save();
    res.status(201).json({ reservation: reservation });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const pendingReservationByUser = async (req, res) => {
  const { identityCard } = req.params;
  try {
    const reservations = await Reservations.findAll({
      where: {
        identityCard: identityCard,
        status: "Pending",
      },
    });
    res.status(201).json({ reservations });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
