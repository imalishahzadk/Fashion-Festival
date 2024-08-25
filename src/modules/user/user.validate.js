import Joi from "joi";

export const createUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  Committee: Joi.string().required(),
  position: Joi.string().required(),
  identity: Joi.number().required(),
  additions: Joi.string().required(),
  nationality: Joi.string().required(),
  idNumber: Joi.number().required(),
  birthDate: Joi.string().required(),
  countryKey: Joi.string().required(),
  phone: Joi.number().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  countryOfResidence: Joi.string().required(),
  cityOfResidence: Joi.string().required(),
  twitter: Joi.string().required(),
  instagram: Joi.string().required(),
  snapchat: Joi.string().required(),
  tiktok: Joi.string().required(),
  facebook: Joi.string().required(),
  otherAccounts: Joi.array().items(Joi.string()),
  licenseNumber: Joi.string().required(),
  licensSource: Joi.string().required(),
  agreementAndPrivacy: Joi.boolean().default(false)
});
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(25).required()
});

export const getUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required()
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  CV_Arabic: Joi.string(),
  CV_English: Joi.string(),
  profilePicture: Joi.string(),
  noObjection: Joi.string(),
  Committee: Joi.string(),
  position: Joi.string(),
  identity: Joi.number(),
  additions: Joi.string(),
  nationality: Joi.string(),
  idNumber: Joi.number(),
  birthDate: Joi.date(),
  countryKey: Joi.string(),
  phone: Joi.number(),
  email: Joi.string().email(),
  password: Joi.string(),
  countryOfResidence: Joi.string(),
  cityOfResidence: Joi.string(),
  twitter: Joi.string(),
  instagram: Joi.string(),
  snapchat: Joi.string(),
  tiktok: Joi.string(),
  facebook: Joi.string(),
  otherAccounts: Joi.array().items(Joi.string()),
  licenseNumber: Joi.string(),
  licensSource: Joi.string(),
  agreementAndPrivacy: Joi.boolean().default(false)
});
export const deleteUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required()
});
