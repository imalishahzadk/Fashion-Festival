import mongoose, { Schema } from "mongoose";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
const schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  CV_Arabic: { type: String, required: true },
  CV_English: { type: String, required: true },
  profilePicture: { type: String, required: true },
  noObjection: { type: String, required: true },
  Committee: { type: String, required: true },
  position: { type: String, required: true },
  identity: { type: String, required: true },
  additions: { type: String, required: true },
  nationality: { type: String, required: true },
  idNumber: { type: Number, required: true },
  birthDate: { type: String, required: true },
  countryKey: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  countryOfResidence: { type: String, required: true },
  cityOfResidence: { type: String, required: true },
  twitter: { type: String, required: true },
  instagram: { type: String, required: true },
  snapchat: { type: String, required: true },
  tiktok: { type: String, required: true },
  facebook: { type: String, required: true },
  otherAccounts: [{ type: String }],
  licenseNumber: { type: String, required: true },
  licensSource: { type: String, required: true },
  agreementAndPrivacy: { type: Boolean, default: false },
  otp: { type: Number },
  verified: { type: Boolean, default: false },
});

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
  return await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};
schema.methods.comparePassword = async function (password) {
  return await compare(password, this.password);
};

schema.post("save", (doc) => {
  doc.CV_Arabic = `${process.env.server_URL}/userfolder/` + doc.CV_Arabic;
  doc.CV_English = `${process.env.server_URL}/userfolder/` + doc.CV_English;
  doc.profilePicture = `${process.env.server_URL}/userfolder/` + doc.profilePicture;
  doc.noObjection = `${process.env.server_URL}/userfolder/` + doc.noObjection;
});
schema.post("findById", (doc) => {
  doc.CV_Arabic = `${process.env.server_URL}/userfolder/` + doc.CV_Arabic;
  doc.CV_English = `${process.env.server_URL}/userfolder/` + doc.CV_English;
  doc.profilePicture = `${process.env.server_URL}/userfolder/` + doc.profilePicture;
  doc.noObjection = `${process.env.server_URL}/userfolder/` + doc.noObjection;
});
schema.post("find", (doc) => {
  doc.CV_Arabic = `${process.env.server_URL}/userfolder/` + doc.CV_Arabic;
  doc.CV_English = `${process.env.server_URL}/userfolder/` + doc.CV_English;
  doc.profilePicture = `${process.env.server_URL}/userfolder/` + doc.profilePicture;
  doc.noObjection = `${process.env.server_URL}/userfolder/` + doc.noObjection;
});
const userModel = mongoose.model("user", schema);

export default userModel;
