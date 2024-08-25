import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbConnection = mongoose.connect(process.env.DATA_BASE_URL).then(() => {
  console.log("connection is done");
});

process.on("unhandleRejection", (err) => {
  console.log("unhandleRejection", err);
});

export default dbConnection;
