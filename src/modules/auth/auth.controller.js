import jwt from "jsonwebtoken";
import userModel from "../../../dataBase/models/user.model.js";
import bcrypt from "bcrypt";
import { catchAsyncError } from "../../../middleware/catchAsyncError.js";
import { AppError } from "../../../utilits/AppError.js";
import dotenv from "dotenv";
import { resendOTP } from "../user/user.controller.js";
dotenv.config();
export const signIn = catchAsyncError(async (req, res, next) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email });
  let match = await bcrypt.compare(password, user.password);
  if (user && match) {
    let token = jwt.sign(
      { name: user.name, userId: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.json({ message: "success", token });
  }
  next(new AppError("incorrect email or password "));
});

export const protectedRoutes = (model) => {
  return catchAsyncError(async (req, res, next) => {
    let { token } = req.headers;
    if (!token) return next(new AppError("token not provider", 401));
    let decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded",decoded.id)
    let user = await model.findById(decoded.id);
    console.log("user ",user)
    if (!user) {
      return next(new AppError("user not found"));
    }
    req.user = user;
    next();
  });
};

export const protectedRoutesToDelete = (model) => {
  return catchAsyncError(async (req, res, next) => {
    let { token } = req.headers;
    console.log("token",token)
    if (!token) return next(new AppError("token not provider", 401));
    let decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded",decoded)
    let user = await model.findById(decoded.id);
    if (!user) {
      return next(new AppError("user not found"));
    }
    req.user = user;
    req.params.id = decoded.id;
    console.log("user",req.params)
    next();
  });
};
// email,check we sent an OTP for resendOTP
export const protectedRoutesForOTP = (model) => {
  return catchAsyncError(async (req, res, next) => {
    const email=req.body.email;
    let user = await model.findOne({ email });
    if (!user) {
      return next(new AppError("user not found"));
    }
    req.user = user;
    next();
  });
};

export const allowedTo = (...role) => {
  return catchAsyncError(async (req, res, next) => {
    // console.log("check role ",role,req.user)
    if (!role.includes(req.user.role))
      return next(
        new AppError(`you are not authorized you are ${req.user.role}`, 401)
      );
    next();
  });
};
