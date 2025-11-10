import express from 'express'
import {customerAuth} from '../auth/customerAuth.js'
import {checkOut} from '../controllers/makePaymentController.js'

const checkOutRouter = express.Router();

checkOutRouter.post('/pay', checkOut )

export default checkOutRouter;