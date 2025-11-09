import {signUp} from '../controllers/signUpcontroller.js';
import express from 'express';

const signUpRouter = express.Router();

signUpRouter.post('/signup', signUp);

export default signUpRouter;