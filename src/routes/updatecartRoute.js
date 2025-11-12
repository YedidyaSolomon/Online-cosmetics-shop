import {updateCartItems} from '../controllers/updateItemsInCart.js'
import { customerandGuestAuth } from '../auth/customerAuth.js'
import express from express;


const updateItemRouter = express.Router();
updateCartItems.patch()