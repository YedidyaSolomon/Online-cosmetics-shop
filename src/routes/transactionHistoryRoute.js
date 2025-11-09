import express from 'express'
import {transactionHistory} from '../controllers/transactionHistoryController.js'

const transactionHistoryRoute = express.Router()
transactionHistoryRoute.get('/success', transactionHistory)
transactionHistoryRoute.get('/failed', transactionHistory)
transactionHistoryRoute.get('/pending', transactionHistory)
export default transactionHistoryRoute;