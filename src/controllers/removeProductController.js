
import Product from '../../models/products.js';
export const removeProduct = async (req, res) => {
    const { product_id} = req.params
    if(!product_id){
        console.log("Product ID is required");
        return res.status(400).json({message: 'Product ID is required'});
    }

    const product = await Product.findOne({where: {product_id: product_id}});

    if(!product){
        console.log("Product not found");
        return res.status(404).json({message: 'Product not found'});
    }

    await Product.destroy({where: {product_id: product_id}});

    console.log("Product removed successfully");
    res.status(200).json({message: 'Product removed successfully', product_id});
}
