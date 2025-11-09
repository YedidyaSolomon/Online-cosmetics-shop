import Product from '../../models/products.js';7

export const browseProducts = async (req, res) => {
    const products = await Product.findAll();
    res.status(200).json({ products });
}

export const browseProductbyName = async (req, res) => {
    const { product_name } = req.params;
    if(product_name){
        console.log("Browsing product:", product_name);
    }
    if (!product_name) {
        return res.status(400).json({ message: 'Product name is required' });
    }
    
    const product = await Product.findOne({ where: { product_name: product_name } });
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }       


    res.status(200).json({ message:"productes: ", product });
}