import Order from '../../models/order.js'
import StockReservation  from '../../models/stokeReservation.js';
import { checkStockReservationExpiry } from '../utils/stockReservationExpiry.js';


export const validatePayment = async (req, res)=>{
   
    try{
    const{tx_ref} = req.params;
      const order = await Order.findOne({ where: { tx_ref } });
      const reservation = await StockReservation.findOne({where:{order_id: order.order_id}})
      const expiryResult = await checkStockReservationExpiry(reservation.order_id);
      
      if (!order) return res.status(404).send('Invalid payment link.');
      
      if (order.status === 'expired' || expiryResult.expired) {
      return res.status(400).send('This payment link has expired. Please reorder.');
    }
    
    
   
     res.redirect(order.checkout_url);
     } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong.');
  }

}