import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const fileName = fileURLToPath(import.meta.url);
const __direname = path.dirname(fileName);
dotenv.config({path: path.resolve(__direname, '../.env')});


const secretKey = process.env.SECRET_KEY;

export const generateToken = (payload, expiresIn = '1h')=>{
    try{
     return jwt.sign(payload, secretKey, {expiresIn});
    }catch(error){
        throw new Error('Error generating token');
    }
    
}
