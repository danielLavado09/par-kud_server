import { Reservations } from "../models/Reservations.js";
import { Parking } from "../models/Parking.js";
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
