

import Product from '../../models/products.js';

const getProduct = async () => {
  try {
    const productId = 1;
    const product = await Product.findOne({ where: { product_id: productId } });

    if (product) {
      console.log("Stock:", product.quantity);
    } else {
      console.log("Product not found");
    }
  } catch (err) {
    console.error("Error fetching product:", err);
  }
};

getProduct(); // call the async function
