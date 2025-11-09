import Customer from "../../models/customers.js";
import { comparePassword } from "../utils/hashedPassword.js";
import { generateToken } from "../../config/jwt.js";


export const loginCustomer= async(req, res)=>{
    req.customer;
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({message: "email and password are required"});
    }
       const customer = await Customer.findOne({where: {email}});
         if(!customer){
            return res.status(404).json({message: "email is not registered"});
         }
          const correctPassword = await comparePassword(password, customer.password);
          if(!correctPassword){
            return res.status(401).json({message: "invalid password"});
          }
           const accessToken = generateToken({customer_id: customer.customer_id, email: customer.email, role: customer.role}, '1h');
           console.log("Generated Access Token:", customer.customer_id);
          return res.status(200).json({message: "customer logged in successfully",
            accessToken,
            customer:{
                customer_id: customer.customer_id,
                name: customer.name,
                email: customer.email,
                role: customer.role

            }
          });

}

export const logInAdmin = async(req, res)=>{
    const{email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: "email and password are required"})
    };


    const admin = await Customer.findOne({where: {email, role: 'admin'}});
    if(!admin){
        return res.status(404).json({message: "admin not found"});
    }
    const corectPassword = await comparePassword(password, admin.password);
    if(!corectPassword){
        return res.status(401).json({message: "invalid password"});
    }

    return res.status(200).json({
    message: "admin logged in successfully",
    admin: {
        id: admin.customer_id,
        name: admin.name,
        email: admin.email,
        role: admin.role
    }
});
 

}


