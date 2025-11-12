import { browseProducts, browseProductbyName } from "../controllers/browseProductController.js";
import express from 'express';

const browseProductRouter = express.Router();
browseProductRouter.get('/browse', browseProducts);
browseProductRouter.get('/browse/:product_name', browseProductbyName);
    

export default browseProductRouter;