import { AppError } from "../../utilits/AppError.js";
import authRouter from "./auth/auth.router.js";

import managerRouter from "./manager/manager.router.js";

import userRouter from "./user/user.router.js";

export function init(app) {
  app.use("/api/v1/manager", managerRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/auth", authRouter);

  app.all("*", (req, res, next) => {
    next(new AppError(`can't find this route ${req.originalUrl}`, 404));
  });
}
