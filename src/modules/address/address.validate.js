import Joi from "joi";





export const getAddressSchema = Joi.object({
    id:Joi.string().hex().length(24).required()
})
export const removeAddressSchema = Joi.object({
    id:Joi.string().hex().length(24).required()
})

export const addAddressSchema = Joi.object({
    city:Joi.string().min(2).max(20).required(),
    street:Joi.string().min(2).max(50).required(),
    phone:Joi.number().required()
})

