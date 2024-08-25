import { Router } from "express";
import * as Manager from "./manager.controller.js";
import {
  createManagerSchema,
  deleteManagerSchema,
  getManagerSchema,
  loginManagerSchema,
  updateManagerSchema
} from "./manager.validation.js";
import { validation } from "../../../middleware/validation.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import managerModel from "../../../dataBase/models/manager.model.js";

const managerRouter = Router();

managerRouter
  .route("/register")
  .post(
    validation(createManagerSchema),
    protectedRoutes(managerModel),
    allowedTo("superAdmin"),
    Manager.register
  );
managerRouter
  .route("/login")
  .post(validation(loginManagerSchema), Manager.login);

managerRouter
  .route("/")
  .get(
    protectedRoutes(managerModel),
    allowedTo("superAdmin"),
    Manager.getAllManagers
  );

managerRouter
  .route("/:id")
  .get(validation(getManagerSchema), Manager.getManager)
  .delete(validation(deleteManagerSchema), Manager.deleteManager)
  .put(validation(updateManagerSchema), Manager.updateManager);
export default managerRouter;
