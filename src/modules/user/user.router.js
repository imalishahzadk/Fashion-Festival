import { Router } from "express";
import { validation } from "../../../middleware/validation.js";
import * as user from "./user.controller.js";
import {
  createUserSchema,
  deleteUserSchema,
  getUserSchema,
  loginUserSchema,
  updateUserSchema
} from "./user.validate.js";
import { uploadMixfile } from "../../../middleware/fileUpload.js";
import { allowedTo, protectedRoutes, protectedRoutesForOTP, protectedRoutesToDelete } from "../auth/auth.controller.js";
import userModel from "../../../dataBase/models/user.model.js";
import managerModel from "../../../dataBase/models/manager.model.js";
const userRouter = Router();

userRouter
  .route("/")
  .post(
    uploadMixfile(
      [
        { name: "CV_Arabic", maxCount: 1 },
        { name: "CV_English", maxCount: 1 },
        { name: "profilePicture", maxCount: 1 },
        { name: "noObjection", maxCount: 1 }
      ],
      "userfolder"
    ),
    user.createUser
  )
  .delete(
    protectedRoutesToDelete(userModel),
    user.deleteUser
  )
  .get(protectedRoutes(managerModel), allowedTo("superAdmin"), user.getAllUsers)
  .put(
    protectedRoutes(userModel),
    uploadMixfile(
      [
        { name: "CV_Arabic", maxCount: 1 },
        { name: "CV_English", maxCount: 1 },
        { name: "profilePicture", maxCount: 1 },
        { name: "noObjection", maxCount: 1 }
      ],
      "userfolder"
    ),
    validation(updateUserSchema),
    user.updateUser
  );

userRouter.route("/login").post(validation(loginUserSchema), user.login);

userRouter
  .route("/spasificUser")
  .get(protectedRoutes(userModel), user.getUserSpasificUser);
userRouter
  .route("/:id")
  .get(
    protectedRoutes(managerModel),
    allowedTo("superAdmin"),
    validation(getUserSchema),
    user.getUserById
  )
  .delete(
    protectedRoutes(managerModel),
    allowedTo("superAdmin"),
    validation(deleteUserSchema),
    user.deleteUser
  );

userRouter
.route("/otpValidate")
.post(
 protectedRoutesForOTP(userModel),
 user.otpValidate
)

userRouter
.route("/resendOTP")
.post(
  protectedRoutesForOTP(userModel),
 user.resendOTP
)
export default userRouter;
