import {Router} from 'express'

import { signIn } from './auth.controller.js'
import { signInSchema } from './auth.validate.js'
import { validation } from '../../../middleware/validation.js'
const authRouter = Router()

authRouter.route('/signIn').post(validation(signInSchema),signIn)

export default authRouter