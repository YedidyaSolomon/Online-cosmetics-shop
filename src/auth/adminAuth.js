import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import dotenv from 'dotenv'

const fileName = fileURLToPath(import.meta.url)
const __dirname = dirname(fileName)

dotenv.config({path: path.resolve(__dirname, '../../.env')})

export const adminAuth = async(req, res, next)=>{

    const headerKey = req.headers['admin_key']
    if(!headerKey){
        return res.status(401).json({message: 'Admin key is missing in headeres'})
    }
      if(headerKey !== process.env.ADMIN_KEY){
        return res.status(403).json({message: 'Unauthorized access'})
      }
       next();
    
}
