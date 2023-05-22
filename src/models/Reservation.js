import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { User } from "./User.js";
import { Parking } from "./Parking.js";

export const Reservation = sequelize.define(
  "Reservation",
  {
    reservationId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Confirmed", "Cancelled"),
      allowNull: false,
      defaultValue: "Pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Establece el valor por defecto a la fecha y hora actual
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

// Define las relaciones de llaves foráneas
Reservation.belongsTo(User, { foreignKey: "identityCard" });
Reservation.belongsTo(Parking, { foreignKey: "parkingId" });
User.hasMany(Reservation, { foreignKey: "identityCard" });
Parking.hasMany(Reservation, { foreignKey: "parkingId" });
