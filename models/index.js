// models/index.js
import sequelize from '../config/db.js';
import Customer from './customers.js';
import Product from './products.js';
import Cart from './cart.js';
import CartItem from './cartItems.js';
import Order from './order.js';
import OrderItem from './orderItem.js';
import Transaction from './transaction.js';
import StockReservation from './stokeReservation.js';
import Admin from './admin.js';

// ===== Customer ↔ Cart & Orders =====
Customer.hasOne(Cart, { foreignKey: 'customer_id', onDelete: 'CASCADE' });
Cart.belongsTo(Customer, { foreignKey: 'customer_id' });

Customer.hasMany(Order, { foreignKey: 'customer_id', onDelete: 'CASCADE' });
Order.belongsTo(Customer, { foreignKey: 'customer_id' });

// ===== Cart ↔ CartItem =====
Cart.hasMany(CartItem, { foreignKey: 'cart_id', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

// ===== Product ↔ CartItem =====
Product.hasMany(CartItem, { foreignKey: 'product_id', onDelete: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });

// ===== Order ↔ OrderItem =====
Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// ===== Product ↔ OrderItem =====
Product.hasMany(OrderItem, { foreignKey: 'product_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

// ===== Order ↔ Transaction =====
Order.hasMany(Transaction, { foreignKey: 'order_id', onDelete: 'CASCADE' });
Transaction.belongsTo(Order, { foreignKey: 'order_id' });

// ===== Order ↔ StockReservation =====
Order.hasMany(StockReservation, { foreignKey: 'order_id', onDelete: 'CASCADE' });
StockReservation.belongsTo(Order, { foreignKey: 'order_id' });

// ===== Product ↔ StockReservation =====
Product.hasMany(StockReservation, { foreignKey: 'product_id', onDelete: 'CASCADE' });
StockReservation.belongsTo(Product, { foreignKey: 'product_id' });

// ===== Admin =====
// Admin is standalone, no foreign keys needed

export {
  sequelize,
  Customer,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Transaction,
  StockReservation,
  Admin,
};
