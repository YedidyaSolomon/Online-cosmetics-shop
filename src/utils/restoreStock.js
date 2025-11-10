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

    const now = new Date();
    const isExpired = reservation.expires_at <= now;

    if (isExpired) {
      console.log(`Reservation expired, incrementing product quantity for product ${productId} by ${quantity}`);
      await Product.increment('quantity', {
        by: quantity,
        where: { product_id: productId },
        transaction: t
      });
      console.log(`Setting reservation status to expired for product ${productId}`);
      await reservation.update({ status: 'expired' }, { transaction: t });
      await t.commit();
      console.log('Stock restoration completed successfully due to expiry');
      return { restored: true, message: 'Stock successfully restored due to reservation expiry.' };
    } else {
      console.log('Reservation not expired, not restoring stock');
      await t.commit();
      return { restored: false, message: 'Reservation not expired, stock not restored.' };
    }

  } catch (error) {
    await t.rollback();
    console.error('Error restoring stock:', error);
    throw error;
  }
};
