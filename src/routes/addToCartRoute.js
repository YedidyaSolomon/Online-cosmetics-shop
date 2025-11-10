import {addItemsInCart} from '../controllers/addtoCartController.js';
import { customerAuth } from '../auth/customerAuth.js';
import express from 'express';



const addtocartRouter = express.Router();
addtocartRouter.post('/addtocart', addItemsInCart);
export default addtocartRouter;