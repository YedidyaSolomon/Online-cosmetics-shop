import axios from "axios"
import path from 'path'
import { fileURLToPath } from "url"
import {dirname} from 'path'
import dotenv from 'dotenv'

const fileName = fileURLToPath(import.meta.url)
const __dirname = dirname(fileName)
dotenv.config({ path:path.resolve(__dirname, "../../.env") });
 const payload={
     refToken:process.env.REFTOKEN
 }
 export const refreshToken = async(req, res)=>{
    try {
        const response = await axios.post('https://playground.tamcon.et:2727/api/merchants/token/refreshToken', payload, {
            headers:{
                'x-api-key': process.env.API_KEY,
                'Content-Type': 'application/json'
            }
        })
        res.status(200).json(response.data)
    } catch (error) {
        console.error('Error refreshing token:', error.message)
        res.status(500).json({ error: 'Failed to refresh token' })
    }
}
