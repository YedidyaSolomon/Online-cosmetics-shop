import Cart from '../../models/cart.js'
import CartItem from '../../models/cartItems.js'
import Product from '../../models/products.js'
import Customer from '../../models/customers.js'
import { getAvailableProductQuantity } from '../utils/availableQuantityInStock.js'
import {customerandGuestAuth} from '../auth/customerAuth.js'

export const addItemsInCart = async (req, res) => {
  try {
    const customer = req.customer
    const guestId = req.guestId
    const { items } = req.body // array of { product_id, quantity }

    console.log("items: ", items) // Log the items array instead

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' })
    }

    let cart;
    let customerData = null;
    let totalPrice = 0;

    if (req.customerType === 'registered' && customer?.customer_id) {
      // Registered customer
      customerData = await Customer.findOne({
        where: { customer_id: customer.customer_id }
      });

      if (!customerData) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      // Find or create active cart for registered customer
      cart = await Cart.findOne({
        where: { customer_id: customer.customer_id, status: 'active' }
      });

      if (cart) {
        if (new Date() > cart.expired_at) {
          cart.status = 'cancelled';
          await cart.save();
          cart = await Cart.create({
            customer_id: customer.customer_id,
            first_name: customerData.first_name,
            last_name: customerData.last_name,
            status: 'active',
            created_at: new Date(),
            expired_at: new Date(Date.now() + 2 * 60 * 1000)
          });
        }
      } else {
        cart = await Cart.create({
          customer_id: customer.customer_id,
          first_name: customerData.first_name,
          last_name: customerData.last_name,
          status: 'active',
          created_at: new Date(),
          expired_at: new Date(Date.now() + 2 * 60 * 1000)
        });
      }

    } else if (req.customerType === 'guest' && guestId) {
      // Guest user
      cart = await Cart.findOne({
        where: { guest_id: guestId, status: 'active' }
      });

      if (cart) {
        if (new Date() > cart.expired_at) {
          cart.status = 'cancelled';
          await cart.save();
          cart = await Cart.create({
            customer_id: null,
            first_name: '',
            last_name: '',
            guest_id: guestId,
            status: 'active',
            created_at: new Date(),
            expired_at: new Date(Date.now() + 2 * 60 * 1000)
          });
        }
      } else {
        cart = await Cart.create({
          customer_id: null,
          first_name: '',
          last_name: '',
          guest_id: guestId,
          status: 'active',
          created_at: new Date(),
          expired_at: new Date(Date.now() + 2 * 60 * 1000)
        });
      }
    } else {
      return res.status(400).json({ message: 'No customer or guest identified' });
    }

    for (const item of items) {
      const product = await Product.findByPk(item.product_id);

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product_id}` });
      }

      // Check stock
      const availableQty = await getAvailableProductQuantity(item.product_id);
      if (item.quantity > availableQty) {
        return res.status(400).json({ message: `Not enough stock for ${product.product_name}` });
      }

      // Check if item already exists in cart
      const existingCartItem = await CartItem.findOne({
        where: {
          cart_id: cart.cart_id,
          product_id: item.product_id
        }
      });

      if (existingCartItem) {
        // Update existing item
        existingCartItem.quantity += item.quantity;
        existingCartItem.price = product.price * existingCartItem.quantity;
        existingCartItem.updated_at = new Date();
        await existingCartItem.save();
        // accumulate added price
        totalPrice += product.price * item.quantity;
      } else {
        // Create new Cart Item
        const cartItem = await CartItem.create({
          cart_id: cart.cart_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: product.price * item.quantity,
          created_at: new Date(),
          updated_at: new Date(),
        });
        totalPrice += product.price * item.quantity;
      }
    }

    return res.status(200).json({
      
      message: req.customerType === 'guest'
        ? 'Items added to guest cart successfully'
        : 'Items added to customer cart successfully',
      items: items,
      price: totalPrice,
      cart_id: cart.cart_id
      
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}