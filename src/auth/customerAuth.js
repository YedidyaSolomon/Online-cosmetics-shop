import {generateToken} from '../../config/jwt.js';
import Customer from '../../models/customers.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getOrCreateGuestId } from "../utils/guest_idGenerator.js";


const fileName = fileURLToPath(import.meta.url);
const __direname = path.dirname(fileName);
dotenv.config({path: path.resolve(__direname, '../.env')});

export const customerandGuestAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                req.customer = decoded;
                req.customerType = 'registered';
                console.log('Decoded token:', decoded);
            } catch (error) {
                return res.status(403).json({ message: 'Invalid or expired token' });
            }
        }
    }
     if(!req.customer){
        const guestId = getOrCreateGuestId(req);
        req.guestId = guestId;
        req.customerType = 'guest';
       res.setHeader('guest-id', guestId);
     }
    

    next();
}
