import { DataTypes } from "sequelize";
import { Parking } from "./Parking.js";
import { sequelize } from "../database/database.js";

export const Employee = sequelize.define(
  "Employee",
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    identityCard: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
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
  },
  {
    timestamps: false,
  }
);

Employee.belongsTo(Parking, { foreignKey: "parkingId" });
Parking.hasMany(Employee, { foreignKey: "parkingId" });
