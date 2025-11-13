import {paymentHistory} from '../controllers/paymentHistoryController.js'
import { customerandGuestAuth } from '../auth/customerAuth.js'
import express from 'express'

const paymentHistoryRoute = express.Router()
paymentHistoryRoute.get('/:email', customerandGuestAuth, paymentHistory)

export default paymentHistoryRoute;