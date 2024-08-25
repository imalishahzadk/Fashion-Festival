import Joi from "joi";

export const createManagerSchema = Joi.object({
  userName: Joi.string().min(2).max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(25).required()
});
export const loginManagerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(25).required()
});

export const getManagerSchema = Joi.object({
  id: Joi.string().hex().length(24).required()
});

export const updateManagerSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  userName: Joi.string().min(2).max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(25).required()
});

export const deleteManagerSchema = Joi.object({
  id: Joi.string().hex().length(24).required()
});
