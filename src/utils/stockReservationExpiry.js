import { sequelize } from '../../models/index.js';
import StockReservation from '../../models/stokeReservation.js';
import Product from '../../models/products.js';
import Order from '../../models/order.js';

export const checkStockReservationExpiry = async (order_id) => {
  console.log(`Checking expiry for order ${order_id}`);
  const t = await sequelize.transaction();

  try {
    const reservations = await StockReservation.findAll({
      where: { order_id, status: 'active' },
      transaction: t
    });

    if (!reservations.length) {
      console.log('No active reservations found');
      await t.commit();
      return { expired: false, message: "No active reservations found." };
    }

    const now = new Date();
    let expiredCount = 0;

    for (const r of reservations) {
      console.log(`Checking reservation for product ${r.product_id}, expires at ${r.expires_at}`);
      if (r.expires_at <= now) {
        console.log(`Reservation expired, restoring stock for product ${r.product_id}`);
       // Restore product stock
        await Product.increment('quantity', {
          by: r.reserved_quantity,
          where: { product_id: r.product_id },
          transaction: t
        });

        //  Update reservation status
        await r.update({ status: 'expired' }, { transaction: t });
        expiredCount++;
      }
    }

    //Optionally mark the order as expired
    if (expiredCount > 0) {
      console.log(`Marking order ${order_id} as expired`);
      await Order.update(
        { status: 'expired' },
        { where: { order_id }, transaction: t }
      );
    }

    await t.commit();

    console.log(`Expiry check completed: ${expiredCount} expired reservations`);
    return {
      expired: expiredCount > 0,
      message: expiredCount > 0
        ? `Expired ${expiredCount} reservation(s)`
        : "All reservations still active"
    };

  } catch (error) {
    await t.rollback();
    console.error("Error in checkStockReservationExpiry:", error);
    throw error;
  }
};

export const isReservationExpired = async (orderId) => {
  const reservations = await StockReservation.findAll({
    where: { order_id: orderId, status: 'active' }
  });

  if (!reservations.length) {
    return false;
  }

  const now = new Date();
  return reservations.some(r => r.expires_at <= now);
};
