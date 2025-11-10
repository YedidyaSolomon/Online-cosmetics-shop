import {validatePayment} from '../controllers/redirectCustomerController.js'
import express from 'express'

const redirectRoute = express.Router()
redirectRoute.get('/pay/:tx_ref', validatePayment)

export default redirectRoute;