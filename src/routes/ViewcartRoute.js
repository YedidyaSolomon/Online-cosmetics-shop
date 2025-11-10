import {viewCart} from '../controllers/viewCartController.js'
import express from 'express'


const viewCartRouter = express.Router();
viewCartRouter.get('/viewcart', viewCart)

export default viewCartRouter;