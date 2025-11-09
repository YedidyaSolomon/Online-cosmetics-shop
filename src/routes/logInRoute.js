import express from 'express';
import { loginCustomer, logInAdmin } from '../controllers/loginControllers.js';

const loginRouter = express.Router();

loginRouter.post('/login', loginCustomer);
loginRouter.post('/admin/login', logInAdmin);

export default loginRouter;