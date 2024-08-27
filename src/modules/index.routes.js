// index.routes.js

import { AppError } from "../../utilits/AppError.js";
import authRouter from "./auth/auth.router.js";
import managerRouter from "./manager/manager.router.js";
import userRouter from "./user/user.router.js";
import uploadRoutes from "../../middleware/uploadRoutes.js";
import express from "express";

// Create a router for the landing page
const landingRouter = express.Router();

landingRouter.get("/", (req, res) => {
  res.send("Welcome to the Landing Page!");
});

export function init(app) {
  // Define landing page route first
  app.use("/", landingRouter);

  // Define existing routes
  app.use("/api/v1/manager", managerRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/auth", authRouter);

  // Add file upload routes
  app.use("/api/v1/uploads", uploadRoutes); // Mount file upload routes

  // Handle 404 errors
  app.all("*", (req, res, next) => {
    next(new AppError(`can't find this route ${req.originalUrl}`, 404));
  });
}
