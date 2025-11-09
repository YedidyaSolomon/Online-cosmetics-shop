import {generateToken} from '../../config/jwt.js';
import Customer from '../../models/customers.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const fileName = fileURLToPath(import.meta.url);
const __direname = path.dirname(fileName);
dotenv.config({path: path.resolve(__direname, '../.env')});

export const customerAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if(!authHeader){
        return res.status(401).json({message: 'Authorization header missing'});
    }

    const token = authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({message: 'Token missing'});
    }
    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.customer = decoded
        console.log('Decoded token:', decoded);
        next();
    }catch(error){
        return res.status(403).json({message: 'Invalid or expired token'});
    }
}
