import Express from "express";
import dbConnection from "./dataBase/dbConnection.js";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors"; // Import cors
import { init } from "./src/modules/index.routes.js";
dotenv.config();

const app = Express();
dbConnection;

// Enable CORS for all routes
app.use(cors());

app.use(Express.json());
app.use(morgan("combined"));
app.use(Express.static("uploads"));
app.use(morgan("dev"));
init(app);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ err: err.message, statusCode });
});

app.listen(3101, () => {
  console.log("server is running", 3101);
});