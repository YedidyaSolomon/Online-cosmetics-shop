import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url /*gives the url of the current file*/);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log({env:process.env.DATABASE_URL})

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',   
  logging: false        
});




export default sequelize;
