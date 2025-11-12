import express from 'express'
import {customerandGuestAuth} from '../auth/customerAuth.js'
import {checkOut} from '../controllers/makePaymentController.js'

const checkOutRouter = express.Router();

checkOutRouter.post('/pay', customerandGuestAuth, checkOut )

export default checkOutRouter;