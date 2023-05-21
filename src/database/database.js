import { Sequelize } from "sequelize";
import { db_name, db_user, db_psswd } from "../config.js";

export const sequelize = new Sequelize(
  db_name, // db name,
  db_user, // username
  db_psswd, // password
  {
    host: "localhost",
    dialect: "postgres",
    // pool: {
    //   max: 5,
    //   min: 0,
    //   require: 30000,
    //   idle: 10000,
    // },
    // logging: false,
  }
);
