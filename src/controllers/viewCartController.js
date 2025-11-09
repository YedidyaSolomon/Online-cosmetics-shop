import Cart from '../../models/cart.js';
import CartItem from '../../models/cartItems.js';
import Product from '../../models/products.js';

export const viewCart = async (req, res) => {
  try {
    const customer = req.customer;

    const cart = await Cart.findOne({
      where: { customer_id: customer.customer_id, status: 'active' },
      order: [['cart_id', 'DESC']],
      attributes: ['cart_id', 'first_name', 'last_name', 'customer_id', 'status']
    });

    if (!cart) {
      return res.status(404).json({ message: 'No active cart found' });
    }
    if(cart.status === 'cancelled'){
        return res.status(404).json({ message: 'the cart is expired' });
    }


    const cartItems = await CartItem.findAll({
      where: { cart_id: cart.cart_id },
      attributes: ['product_id', 'quantity', 'price', 'name'],
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({
        message: 'Cart is empty',
        cart_id: cart.cart_id,
        first_name: cart.first_name,
        last_name: cart.last_name,
        items: []
      });
    }

  
    res.status(200).json({
      message: 'Cart retrieved successfully',
      cart_id: cart.cart_id,
      customer_id: cart.customer_id,
      first_name: cart.first_name,
      last_name: cart.last_name,
      status: cart.status,
      items: cartItems.map(item => ({
        product_id: item.product_id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    });

  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
