import { DataTypes } from "sequelize";
import { sequelize } from "../database/database";
import { User } from "./User";
import { Parking } from "./Parking";

export const Reservation = sequelize.define("Reservation",{
    id:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    status:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createdAt:{
        type: DataTypes.TIME,
        allowNull: false,
    },
    startTime:{
        type: DataTypes.TIME,
        allowNull: false,
    },
    endTime:{
        type: DataTypes.TIME,
        allowNull: false,
    }
});
//Reservation belongs to a single User and a single Parking
Reservation.belongsTo(User)
Reservation.belongsTo(Parking)
//User and a Parking can have multiple Reservations
User.hasMany(Reservation)
Parking,hasMany(Reservation)