import {addItemsInCart} from '../controllers/addtoCartController.js';
import { customerandGuestAuth } from '../auth/customerAuth.js';
import express from 'express';



const addtocartRouter = express.Router();
addtocartRouter.post('/addtocart',customerandGuestAuth, addItemsInCart);
export default addtocartRouter;