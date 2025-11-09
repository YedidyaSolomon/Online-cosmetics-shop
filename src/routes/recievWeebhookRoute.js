import express from 'express'
import { webhookResponse } from '../controllers/recieveWebhookController.js'

const webhookRoute = express.Router()
webhookRoute.post('/payment/webhook', webhookResponse)

export default webhookRoute;
