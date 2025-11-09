import { sequelize } from '../../models/index.js';
import StockReservation from '../../models/stokeReservation.js';
import Product from '../../models/products.js';

export const restoreStock = async (productId, quantity, orderId) => {
  console.log(`Restoring stock: Product ${productId}, Quantity ${quantity}, Order ${orderId}`);
  const t = await sequelize.transaction();

  try {
    const reservation = await StockReservation.findOne({
      where: { order_id: orderId, product_id: productId, status: 'active' },
      transaction: t
    });

    if (!reservation) {
      console.log('No active reservation found for this product and order');
      await t.commit();
      return { restored: false, message: 'No active reservation found for this product and order.' };
    }

    console.log(`Incrementing product quantity for product ${productId} by ${quantity}`);
    await Product.increment('quantity', {
      by: quantity,
      where: { product_id: productId },
      transaction: t
    });

    console.log(`Setting reservation status to released for product ${productId}`);
    await reservation.update({ status: 'released' }, { transaction: t });

    await t.commit();
    console.log('Stock restoration completed successfully');
    return { restored: true, message: 'Stock successfully restored.' };

  } catch (error) {
    await t.rollback();
    console.error('Error restoring stock:', error);
    throw error;
  }
};
