import StockReservation from '../../models/stokeReservation.js';
import Product from '../../models/products.js';
import { getAvailableProductQuantity } from './availableQuantityInStock.js';

export const reserveStock = async (productId, quantity, orderId, transaction = null) => {
  console.log(`Reserving stock: Product ${productId}, Quantity ${quantity}, Order ${orderId}`);
  const stock = await getAvailableProductQuantity(productId);
  console.log(`Available stock for product ${productId}: ${stock}`);

  if (stock < quantity) {
    throw new Error(`Insufficient stock for product ID: ${productId}`);
  }

  console.log(`Creating reservation for product ${productId}`);
  await StockReservation.create({
    order_id: orderId,
    product_id: productId,
    reserved_quantity: quantity,
    status: 'active',
    reserved_at: new Date(),
    expires_at: new Date(Date.now() + 10 * 60 * 1000) // expires after 10 minutes
  }, { transaction });

  console.log(`Decrementing product quantity for product ${productId} by ${quantity}`);
  await Product.decrement('quantity', {
    by: quantity,
    where: { product_id: productId },
    transaction
  });
  console.log(`Stock reservation completed for product ${productId}`);
};
