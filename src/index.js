import express, { json } from "express";
import morgan from "morgan";
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));

app.listen(PORT, () => {
  console.log("Server running at 3000");
});
