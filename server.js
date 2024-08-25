import Express from "express";
import dbConnection from "./dataBase/dbConnection.js";
import morgan from "morgan";
import dotenv from "dotenv";
import Morgan from "morgan";
import { init } from "./src/modules/index.routes.js";
dotenv.config();

const app = Express();
dbConnection;
app.use(Express.json());
app.use(morgan("combined"));
app.use(Express.static("uploads"));
app.use(Morgan("dev"));
init(app);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ err: err.message, statusCode });
});
app.listen(3000, () => {
  console.log("server is running");
});
