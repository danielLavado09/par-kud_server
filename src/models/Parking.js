import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Parking = sequelize.define(
  "Parking",
  {
    parkingId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slots: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sedanHourlyRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    suvHourlyRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    motorcycleHourlyRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    openingTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    closingTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isCovered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);