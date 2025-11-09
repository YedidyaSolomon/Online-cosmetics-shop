import {removeProduct} from '../controllers/removeProductController.js';
import express from 'express';

const removeProductRouter = express.Router();

removeProductRouter.delete('/:product_id', removeProduct);
export default removeProductRouter;