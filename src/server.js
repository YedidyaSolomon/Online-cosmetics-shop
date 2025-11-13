import sequelize from "../config/db.js";
import express from 'express'
import '../models/index.js';
import signUpRouter from './routes/signUpRoute.js';
import loginRouter from './routes/logInRoute.js';
import addproductRouter from './routes/addProductRoute.js';
import { adminAuth } from "./auth/adminAuth.js";
import removeProductRouter from './routes/removeProductRoute.js';
import browseProductRouter from "./routes/browseProductRoute.js";
import addtocartRouter from "./routes/addToCartRoute.js";
import viewCartRouter from "./routes/ViewcartRoute.js";
import webhookRoute from "./routes/recievWeebhookRoute.js";
import checkOutRouter from "./routes/makePaymentRoute.js"
import transactionHistoryRoute from './routes/transactionHistoryRoute.js'
import refreshRouter from './routes/refreshTokenRoute.js'
import { customerandGuestAuth } from "./auth/customerAuth.js";
import updatecartItemRouter from './routes/updateItemnInCart.js'
import redirectRout from './routes/redirectCustomerRoute.js'
import paymentHistoryRoute from './routes/paymentHistoryRoute.js'

const app= express()
const PORT = 3000

app.use(express.json());
app.use('/api/paymentHistory', paymentHistoryRoute)
app.use('/api', redirectRout)
app.use('/api/cartItems', updatecartItemRouter)
app.use('/api/refresh', adminAuth, refreshRouter)
app.use('/api/transaction', adminAuth, transactionHistoryRoute)
app.use('/api/payment', checkOutRouter)
app.use('/api', webhookRoute)
app.use('/api', viewCartRouter)
app.use('/api/cart', addtocartRouter);
app.use('/api',browseProductRouter);
app.use('/api/product/remove', adminAuth , removeProductRouter);
app.use('/api/product', adminAuth , addproductRouter);
app.use('/api', loginRouter);     
app.use('/api/customer', signUpRouter);



const startServer =async ()=>{
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        app.listen(PORT, ()=>{
            console.log(`app running on port${PORT}`)
        } )
    }catch(error){
        console.log("error creating database: ", error)
    }
}

startServer();