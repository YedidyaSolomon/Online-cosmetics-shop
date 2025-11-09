
import  {hashPassword}  from "../utils/hashedPassword.js";
import dotenv from "dotenv";
import {dirname} from 'path'
import { fileURLToPath } from "url";
//import {Customer} from '../models/customers.js'
import Customer from '../../models/customers.js';


const filename = fileURLToPath(import.meta.url);    
const __dirname = dirname(filename);
dotenv.config({ path: __dirname + '/../.env' });

const signUp = async (req, res) => {
    const{firstName, lastName, email, admin_password, phone_number} = req.body;

    if (!firstName || !lastName || !email || !admin_password) {
        return res.status(400).json({ message: "firstName, lastName, email, and admin_password are required" });
    }

     const hashedPassword = await hashPassword(admin_password);
    let role = 'customer'
    const adminSecret = process.env.ADMIN_SECRET
     if(adminSecret===admin_password){
        role = 'admin'
     }

     try {
         const existingUser = await Customer.findOne({where: {email}});  
        console.log("3. Existing user check:", existingUser ? "Exists" : "Not exists");
       if (existingUser) {
            return res.status(400).json({ error: "customer with this email already exist" });
         }
         const customer = await Customer.create({
            first_name: firstName,
            last_name: lastName,
            email,
            role,
            password: hashedPassword,
            phone_number
         })

         console.log("customer created successfuly: ", customer);

         res.status(201).json({message: "customer created successfully",

            customer_id: customer.customer_id,
            firstName: customer.first_name,
            lastName: customer.last_name,
            email: customer.email,
            role: customer.role,
            phone_number: customer.phone_number,
            });
     } catch (error) {
         if (error.name === 'SequelizeValidationError') {
             const messages = error.errors.map(err => err.message);
             console.log('Sequelize validation errors:', messages);
             return res.status(400).json({ error: messages.join(', ') });
         }
         console.error('Error creating customer:', error);
         res.status(500).json({ error: 'Internal server error' });
     }

}

export {signUp};