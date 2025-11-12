import {updateCartItems} from '../controllers/updateItemsInCart.js'
import { customerandGuestAuth } from '../auth/customerAuth.js'
import express from 'express'

const updatecartItemRouter = express.Router()
updatecartItemRouter.put('/update', updateCartItems)

export default updatecartItemRouter;