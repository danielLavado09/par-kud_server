import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Parking = sequelize.define(
  "Parking",
  {
    parking_id: {
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
    sedan_hourly_rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    suv_hourly_rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    motorcycle_hourly_rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    opening_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    closing_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    img_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_covered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
