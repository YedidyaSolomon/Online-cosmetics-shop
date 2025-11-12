import {viewCart} from '../controllers/viewCartController.js'
import { customerandGuestAuth } from '../auth/customerAuth.js';
import express from 'express'


const viewCartRouter = express.Router();
viewCartRouter.get('/viewcart', customerandGuestAuth, viewCart)

export default viewCartRouter;