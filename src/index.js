import app from "./app.js";
import { sequelize } from "./database/database.js";

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await sequelize.authenticate();
    // Drop a la DB en cada start.
    await sequelize.sync({ force: false });
    console.log("Connected to the database.");
    app.listen(PORT, () => {
      console.log("Server running at 3000");
    });
  } catch (error) {
    console.error("Unable to connect to the database.");
  }
}

main();
