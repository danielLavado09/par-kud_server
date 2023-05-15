import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const User = sequelize.define("User", {
  cc: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bookings: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});
