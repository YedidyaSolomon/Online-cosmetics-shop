import Product from "../../models/products.js";


export const getAvailableProductQuantity = async (productId) => {
    try{
    const product = await Product.findOne({ where: { product_id: productId } });
    if(product){
        return product.quantity;
    }
   
    
}catch(error){
    console.error('Error fetching product quantity:', error);
    throw error;
}
}
