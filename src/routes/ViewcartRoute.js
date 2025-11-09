import {viewCart} from '../controllers/viewCartController.js'
import express from 'express'
import { customerAuth } from '../auth/customerAuth.js';

const viewCartRouter = express.Router();
viewCartRouter.get('/viewcart',customerAuth, viewCart)

export default viewCartRouter;