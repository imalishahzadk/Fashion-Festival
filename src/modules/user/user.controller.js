import { catchAsyncError } from "../../../middleware/catchAsyncError.js";
import { AppError } from "../../../utilits/AppError.js";
import { ApiFeature } from "../../../utilits/AppFeature.js";
import userModel from "../../../dataBase/models/user.model.js";
import fs from "fs/promises";
import path from "path";
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  host: 'live.smtp.mailtrap.io',
  port: 587,
  auth: {
    user: 'api', // Replace with your Mailtrap username
    pass: 'af8b571eb6d44e13b7a92f3ec3762a61', // Replace with your Mailtrap password
  },
});
const createUser = catchAsyncError(async (req, res, next) => {
  let user = await userModel.findOne({
    $or: [{ email: req.body.email }, { phone: req.body.phone }]
  });
  if (user) {
    if (user.email === req.body.email) {
      return next(new AppError("Email already exists", 409));
    }
    if (user.phone === req.body.phone) {
      return next(new AppError("Phone number already exists", 409));
    }
  }
  req.body.CV_Arabic = req.files.CV_Arabic[0].filename;
  req.body.CV_English = req.files.CV_English[0].filename;
  req.body.profilePicture = req.files.profilePicture[0].filename;
  req.body.noObjection = req.files.noObjection[0].filename;
  let result = new userModel(req.body);
  // sendOTP(); create a function to send OTP
  // console.log("otp",result.otp)
  // result.otp = 1234;
  result.otp= await sendOTP();
  await result.save();
  const token = await result.generateToken();
  !result && next(new AppError(`Can't create this User`, 404));
  result && res.json({ messaeg: "success", result, token });
});

const sendOTP = async () => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  console.log("otp", otp);

  const mailOptions = {
    from: '"Mailtrap Test" <mailtrap@demomailtrap.com>',
    to: 'hnysharma1195@gmail.com',
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions).then((info) => {
    console.log(info)
  }).catch((er)=>{
    console.log("error",er)});
return otp

};

const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return next(new AppError("user not found", 400));
  if(!user.verified) return next(new AppError("user not verified. Verify First", 400));
  if (!(await user.comparePassword(password))) {
    return next(new AppError("incorrect email or password"));
  }
  const token = await user.generateToken();
  res.status(200).send({ message: "success", data: user, token });
});

const getAllUsers = catchAsyncError(async (req, res, next) => {
  const apiFeature = new ApiFeature(userModel.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .search()
    .sort();
  const countBlogs = await userModel.find().countDocuments();
  const pageNumber = Math.ceil(countBlogs / 20);
  const result = await apiFeature.mongoseQuery;
  if (!result[0]) {
    return next(new AppError("can't find user"));
  }
  res.status(200).send({
    message: "Success",
    data: {
      page: apiFeature.page,
      result,
      pageNumber
    }
  });
});

const getUserById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const result = await userModel.findById(id);
  !result && next(new AppError(`User not found`, 404));
  result && res.json({ messaeg: "success", result });
});

const getUserSpasificUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.user;
  const result = await userModel.findById(id);
  !result && next(new AppError(`User not found`, 404));
  result && res.json({ messaeg: "success", result });
});

const updateUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.user;
  const { email, phone } = req.body;

  let conditions = [];
  if (email) {
    conditions.push({ email });
  }
  if (phone) {
    conditions.push({ phone });
  }
  if (conditions.length > 0) {
    let user = await userModel.findOne({
      $or: conditions,
      _id: { $ne: id }, 
    });
    if (user) {
      console.log(user,email,phone)
      if (user.email === email) {
        return next(new AppError("Email already exists", 409));
      }
      if (user.phone == phone) {
        return next(new AppError("Phone number already exists", 409));
      }
    }
  }
  let user = await userModel.findById(id);
  if (!user) return next(new AppError("User not found", 404));

  if (req.files.CV_Arabic) {
    const oldCvArabicPath = user.CV_Arabic
      ? path.join(process.cwd(), "uploads", "userfolder", user.CV_Arabic)
      : null;
    req.body.CV_Arabic = req.files.CV_Arabic[0].filename;
    if (oldCvArabicPath) {
      try {
        await fs.unlink(oldCvArabicPath);
      } catch (err) {
        console.error("Error deleting old CV_Arabic:", err);
      }
    }
  }

  if (req.files.CV_English) {
    const oldCvEnglishPath = user.CV_English
      ? path.join(process.cwd(), "uploads", "userfolder", user.CV_English)
      : null;
    req.body.CV_English = req.files.CV_English[0].filename;
    if (oldCvEnglishPath) {
      try {
        await fs.unlink(oldCvEnglishPath);
      } catch (err) {
        console.error("Error deleting old CV_English:", err);
      }
    }
  }

  if (req.files.profilePicture) {
    const oldProfilePicturePath = user.profilePicture
      ? path.join(process.cwd(), "uploads", "userfolder", user.profilePicture)
      : null;
    req.body.profilePicture = req.files.profilePicture[0].filename;
    if (oldProfilePicturePath) {
      try {
        await fs.unlink(oldProfilePicturePath);
      } catch (err) {
        console.error("Error deleting old profilePicture:", err);
      }
    }
  }

  if (req.files.noObjection) {
    const oldNoObjectionPath = user.noObjection
      ? path.join(process.cwd(), "uploads", "userfolder", user.noObjection)
      : null;
    req.body.noObjection = req.files.noObjection[0].filename;
    if (oldNoObjectionPath) {
      try {
        await fs.unlink(oldNoObjectionPath);
      } catch (err) {
        console.error("Error deleting old noObjection:", err);
      }
    }
  }

  user = await userModel.findByIdAndUpdate(id, req.body, { new: true });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.json({ message: "success", user });
});

const deleteUser = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findByIdAndDelete(id, req.body);
  !user && next(new AppError(`user not found`, 404));
  const cvArabicPath = user.CV_Arabic
    ? path.join(process.cwd(), "uploads", "userfolder", user.CV_Arabic)
    : null;
  const cvEnglishPath = user.CV_Arabic
    ? path.join(process.cwd(), "uploads", "userfolder", user.CV_English)
    : null;
  const noObjection = user.CV_Arabic
    ? path.join(process.cwd(), "uploads", "userfolder", user.noObjection)
    : null;
  const profilePicture = user.CV_Arabic
    ? path.join(process.cwd(), "uploads", "userfolder", user.profilePicture)
    : null;

  try {
    await fs.unlink(cvArabicPath);
    await fs.unlink(cvEnglishPath);
    await fs.unlink(noObjection);
    await fs.unlink(profilePicture);
  } catch (err) {}

  user && res.json({ messaeg: "success" });
});

const otpValidate = catchAsyncError(async (req, res, next) => {
  const { id } = req.user;
  console.log("result ", id);
  const result = await userModel.findById(id);
  if (!result) return next(new AppError(`User not found`, 404));
  if (result.otp != req.body.otp) return next(new AppError(`OTP incorrect. Please try again`, 404));
  
  req.body = { verified: true };
  console.log("body ", req.body );
  
  const user = await userModel.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({ message: "success", user });
});


export {
  getAllUsers,
  getUserSpasificUser,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  login,
  otpValidate
};
