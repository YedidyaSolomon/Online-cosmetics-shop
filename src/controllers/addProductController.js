import Product from '../../models/products.js';
export const addNewProduct = async (req, res) => {
    const { product_id, product_name, price, quantity, description } = req.body;
    if (!product_id, !product_name || !price || !quantity || !description) {
        return res.status(400).json({ message: 'All fields are required' });
    }
     const quantityInDb = await Product.findOne({ where: { product_name: product_name} });
     const productName = await Product.findOne({ where: { product_name: product_name} });

     if(productName){
         const totalQuantity = parseInt(quantityInDb.quantity) + parseInt(quantity);
         console.log("total quantity", totalQuantity);
    const newProduct = await Product.update({
        quantity: totalQuantity,
        status: 'active'
    }, { where: { product_name: product_name } });
     
    console.log("product updated");
    return res.status(200).json({ message: 'Product quantity updated successfully',
         product_id: productName.id,
         product_name:productName.product_name,
         price: productName.price,
         quantity: totalQuantity,
         description: productName.description,
         status: 'active'
 });
     }

     const newProduct = await Product.create({
        product_name,
        price,
        quantity,
        description
 } );
 console.log("new product added");
 res.status(201).json({message:"Product added successfuly",
   product_id: newProduct.id,
   product_name:newProduct.product_name,
   price: newProduct.price,
   quantity: newProduct.quantity,
   description: newProduct.description
 })
}
