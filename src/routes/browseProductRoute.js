import { browseProducts, browseProductbyName } from "../controllers/browseProductController.js";
import { customerAuth } from "../auth/customerAuth.js";
import express from 'express';

const browseProductRouter = express.Router();
browseProductRouter.get('/browse', browseProducts);
browseProductRouter.get('/browse/:product_name', customerAuth, browseProductbyName);
    

export default browseProductRouter;