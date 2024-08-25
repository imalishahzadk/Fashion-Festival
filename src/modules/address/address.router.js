import {Router} from 'express'
import { validation } from '../../../middleware/validation.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import * as address from './address.controller.js'
import { addAddressSchema, getAddressSchema, removeAddressSchema } from './address.validate.js'
const addressRouter = Router()

addressRouter.route('/:id')
.delete(protectedRoutes,allowedTo('user'),validation(removeAddressSchema),address.removeAddress)
.get(protectedRoutes,allowedTo('user'),validation(getAddressSchema),address.getAddress )

addressRouter.route('/')
.post(protectedRoutes,allowedTo('user'),validation(addAddressSchema), address.addAddress)
.get(protectedRoutes,allowedTo('user'),address.getAllAddresses)

export default addressRouter