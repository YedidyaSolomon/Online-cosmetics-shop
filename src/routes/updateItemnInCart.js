import {updateCartItems} from '../controllers/updateItemsInCart.js'
import { customerAuth } from '../auth/customerAuth.js'
import express from 'express'

const updatecartItemRouter = express.Router()
updatecartItemRouter.put('/update', customerAuth, updateCartItems)

export default updatecartItemRouter;