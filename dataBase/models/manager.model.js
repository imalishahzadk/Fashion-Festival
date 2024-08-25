import mongoose, { Schema } from "mongoose";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
const schema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["superAdmin", "admin"],
      default: "admin"
    }
  },
  { timestamps: true }
);
schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
    return next();
  }
  return next();
});
schema.pre("findByIdAndUpdate", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
    return next();
  }
  return next();
});

schema.methods.generateToken = async function () {
  return  jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};
schema.methods.comparePassword = async function (password) {
  return await compare(password, this.password);
};

const managerModel = mongoose.model("manager", schema);

export default managerModel;
