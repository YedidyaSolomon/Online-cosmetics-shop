import express from 'express';
import { addNewProduct } from '../controllers/addProductController.js';

const addproductRouter = express.Router();

addproductRouter.post('/add', addNewProduct);

export default addproductRouter;