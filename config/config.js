import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const defaultUrl =
  process.env.DATABASE_URL ||
  `postgres://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASS || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'onlineCosmeticsShop'}`;

const config = {
  development: {
    url: defaultUrl,
    dialect: 'postgres'
  },
  test: {
    url: process.env.DATABASE_URL_TEST || defaultUrl,
    dialect: 'postgres'
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    }
  }
};

export default config;
