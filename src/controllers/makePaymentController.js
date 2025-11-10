import Order from '../../models/order.js'
import OrderItem from '../../models/orderItem.js'
import Customer from '../../models/customers.js'
import Cart from '../../models/cart.js'
import Product from '../../models/products.js'
import { getAvailableProductQuantity } from '../utils/availableQuantityInStock.js';
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath, fileURLToPath as FileURLtoPath } from 'url';
import {dirname} from 'path'
import CartItem from '../../models/cartItems.js'
import Transaction  from '../../models/transaction.js'
import axios from 'axios'
import { sequelize } from '../../models/index.js';
import StockReservation from '../../models/stokeReservation.js'
import { reserveStock } from '../utils/stockReservation.js';

const fileName = fileURLToPath(import.meta.url)
const __dirname = dirname(fileName)
dotenv.config({ path:path.resolve(__dirname, "../../.env") });

export const calculateCartTotal = async (cart_id) => {
  const cartItems = await CartItem.findAll({
    where: { cart_id },
    attributes: ['price', 'quantity']
  });


  let total = 0;
  for (const item of cartItems) {
       total += Number(item.price);
  }
  
  console.log("total: ", total)
  return total;
};


export const checkOut = async (req, res) => {
  const customer = req.customer;
  const customers = await Customer.findOne({where:{customer_id:  customer.customer_id}})
  
  const cart = await Cart.findOne({ where: { customer_id: customer.customer_id, status: 'active' } });
  if (!cart) return res.status(404).json({ message: "No active cart found" });

  const cartItems = await CartItem.findAll({
    where: { cart_id: cart.cart_id },
    include: [{ model: Product, attributes: ['product_name', 'quantity', 'product_id'] }],
  });
  if (!cartItems.length) return res.status(400).json({ message: "Cart is empty" });

  const t = await sequelize.transaction(); // start transaction
 
  try {
    
    for (const item of cartItems) {
      const stock = await getAvailableProductQuantity(item.product_id);
      if (item.quantity > stock) throw new Error(`Not enough stock for ${item.Product.product_name}`);
    }

    const totalPrice = await calculateCartTotal(cart.cart_id);
     
    // Initiate payment request (outside DB transaction — API call can be async)
    
    
    const payload = {
      amount: totalPrice,
      currency: 'ETB',
      email: customer.email,
      first_name: cart.first_name,
      last_name: cart.last_name,
      phone_number: customers.phone_number,
      callback_url: '',
      return_url: ''
    };

     const paymentResponse = await axios.post(
      
      'https://playground.tamcon.et:2727/api/payments/initiatePayment',
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
          'x-api-key': process.env.API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    
    if (!paymentResponse.data.checkout_url || !paymentResponse.data.tx_ref) {
      throw new Error("Payment initiation failed");
    }

    //create Order and OrderItems inside transaction
    console.log("Creating order for customer:", customer.customer_id);
    const order = await Order.create({
      customer_id: customer.customer_id,
      status: 'pending',
      total_amount: totalPrice,
      tx_ref: paymentResponse.data.tx_ref,
      checkout_url: paymentResponse.data.checkout_url
    }, { transaction: t });
    console.log("Order created with ID:", order.order_id);

    for (const item of cartItems) {
      console.log("Creating order item for product:", item.product_id, "Quantity:", item.quantity);
      await OrderItem.create({
        order_id: order.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }, { transaction: t });
    }
    console.log("Order items created");

    //Reserve stock and decrement product quantities
    for (const item of cartItems) {
      console.log("Reserving stock for product:", item.product_id, "Quantity:", item.quantity);
      await reserveStock(item.product_id, item.quantity, order.order_id, t);
    }
    console.log("Stock reservation completed for order:", order.order_id);

    await t.commit();
    console.log("Transaction committed successfully");
    console.log(paymentResponse.data)
    res.status(200).json({
      message: "Payment initialized successfully from e-commerce",
      data: {
        payment_url: `http://localhost:3000/api/pay/${paymentResponse.data.tx_ref}`,
        tx_ref: paymentResponse.data.tx_ref
      }
    });

  } catch (error) {
    // Rollback transaction if anything failed
    await t.rollback();
    res.status(500).json({
      message: "Error processing checkout",
      error: error.message || error.response?.data || error

    });
  }
};

  

