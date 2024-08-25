import { catchAsyncError } from "../../../middleware/catchAsyncError.js";
import { AppError } from "../../../utilits/AppError.js";
import { ApiFeature } from "../../../utilits/AppFeature.js";
import managerModel from "../../../dataBase/models/manager.model.js";

const register = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const oldmanager = await managerModel.findOne({ email });
  if (oldmanager) return next(new AppError("manager already exists", 400));
  const manager = new managerModel(req.body);
  await manager.save();
  const token = await manager.generateToken();
  res.status(200).send({ message: "success", data: manager, token });
});

const login = catchAsyncError(async (req, res, next) => {
  console.log("login");

  const { email, password } = req.body;
  const manager = await managerModel.findOne({ email });
  if (!manager) return next(new AppError("manager not found", 400));
  if (!(await manager.comparePassword(password))) {
    return next(new AppError("incorrect email or password"));
  }
  const token = await manager.generateToken();
  res.status(200).send({ message: "success", data: manager, token });
});
const getAllManagers = catchAsyncError(async (req, res, next) => {
    console.log(req.user);
    
  const apiFeature = new ApiFeature(managerModel.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .search()
    .sort();
  const countBlogs = await managerModel.find().countDocuments();
  const pageNumber = Math.ceil(countBlogs / 20);
  const result = await apiFeature.mongoseQuery;
  if (!result[0]) {
    return next(new AppError("can't find manager"));
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

const getManager = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const result = await managerModel.findById(id);
  !result && next(new AppError(`manager not found`, 404));
  result && res.json({ messaeg: "success", result });
});
const updateManager = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const result = await managerModel.findByIdAndUpdate(id, req.body, {
    new: true
  });
  !result && next(new AppError(`manager not found`, 404));
  result && res.json({ messaeg: "success", result });
});
const deleteManager = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const result = await managerModel.findByIdAndDelete(id, req.body);
  !result && next(new AppError(`manager not found`, 404));
  result && res.json({ messaeg: "success", result });
});

export {
  register,
  getAllManagers,
  getManager,
  updateManager,
  deleteManager,
  login
};
