import StockReservation from '../../models/stokeReservation.js';
import Product from '../../models/products.js';
import Order from '../../models/order.js';
import Transaction from '../../models/transaction.js';
import { checkStockReservationExpiry, isReservationExpired } from '../utils/stockReservationExpiry.js';
import { restoreStock } from '../utils/restoreStock.js';


export const webhookResponse = async (req, res) => {

   res.status(200).send('Webhook processed successfully');
  console.log('=== Incoming Webhook Request ===');
  //console.log('Headers:', req.headers);
  //console.log('Body:', JSON.stringify(req.body, null, 2));
  const event = req.body.event || req.body.status || req.body.data?.status;
   const tx_ref = req.body.tx_ref || req.body.data?.tx_ref;

  console.log('=== WEBHOOK RECEIVED ===');
 // console.log('Event:', event, 'Tx_ref:', tx_ref);
  console.log('Full Body:', JSON.stringify(req.body, null, 2));
  
  try {
    const order = await Order.findOne({ where: { tx_ref  } });
    if (!order) {
      console.log('Order not found for tx_ref:', tx_ref);
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check reservation expiry before any action
    await checkStockReservationExpiry(order.order_id);

    // Fetch reservations
    const reservations = await StockReservation.findAll({
      where: { order_id: order.order_id, status: ['active', 'expired'] }
    });

    if (!reservations.length) {
      console.log('No reservations found for order');
    }

    // === Handle Payment Failed or Cancelled ===
    if (['failed', 'cancelled', 'charge.failed', 'charge.cancelled', 'charge.failed/cancelled', 'failed/cancelled'].includes(event)) {
      console.log('Payment failed/cancelled. Restoring stock...');
      for (const resv of reservations) {
        if (resv.status === 'active' || resv.status === 'expired') {
          await restoreStock(resv.product_id, resv.reserved_quantity, order.order_id);
        }
      }

      await order.update({ status: 'failed' });

      await Transaction.create({
        order_id: order.order_id,
        tx_ref,
        status: 'failed',
        amount: order.total_amount,
        currency: req.body.currency || 'ETB',
        first_name: req.body.first_name || req.body.data?.first_name,
        last_name: req.body.last_name || req.body.data?.last_name,
        email: req.body.email || req.body.data?.email,
        phone_number: req.body.phone_number || req.body.data?.phone_number,
      });

      console.log('Failed transaction recorded.');
    }

    // === Handle Payment Success ===
    if (event === 'successfull') {
      const expired = await isReservationExpired(order.order_id);

      
      if (expired) {
        console.log('Reservation expired before payment success. Restoring stock...');
        for (const resv of reservations) {
          if (resv.status === 'expired') {
            await restoreStock(resv.product_id, resv.reserved_quantity, order.order_id);
          }
        }
        await order.update({ status: 'failed' });
      } else {
        for (const resv of reservations) {
          await resv.update({ status: 'used' });
        }
        await order.update({ status: 'paid' });
      }

      await Transaction.create({
        order_id: order.order_id,
        tx_ref,
        status: expired ? 'failed' : 'success',
        amount: order.total_amount,
        currency: req.body.currency || 'ETB',
        first_name: req.body.first_name || req.body.data?.first_name,
        last_name: req.body.last_name || req.body.data?.last_name,
        email: req.body.email || req.body.data?.email,
        charge: req.body.charge || req.body.data?.charge,
        phone_number: req.body.phone_number || req.body.data?.phone_number,
      });

      console.log('Success transaction recorded.');
      console.log('Amount:', order.total_amount);
    }

   
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook processing error', error: error.message });
  }
};
