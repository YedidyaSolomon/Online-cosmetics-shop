import Order from '../../models/order.js';
import Transaction from '../../models/transaction.js';
import OrderItem from '../../models/orderItem.js';
import Product from '../../models/products.js';

export const paymentHistory = async (req, res) => {
  try {
    const customer = req.customer;
    
   
    
    if (req.customerType !== 'registered' || !customer?.customer_id) {
      return res.status(403).json({ message: "Access denied. please create account to see you full payment History." });
    }

   
    const orders = await Order.findAll({
      where: { customer_id: customer.customer_id },
      include: [
        {
          model: Transaction,
          attributes: ['status', 'created_at', 'amount']
        },
        {
          model: OrderItem,
          attributes: ['product_name', 'quantity', 'price'],
          include: [
            {
              model: Product,
              attributes: ['product_name']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    if (!orders.length) {
      return res.status(404).json({ message: "No payment history found." });
    }

    const history = orders.map(order => ({
      order_id: order.order_id,
      items: order.OrderItems.map(item => ({
        product_name: item.product_name || item.Product?.product_name,
        quantity: item.quantity,
        price: item.price
      })),
      total_payment: order.Transaction?.amount,
      payment_status: order.Transaction?.status,
      payment_date: order.Transaction?.created_at
    }));

    res.status(200).json({
      message: "Your payment history",
      history
    });

  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ message: "Server error while fetching payment history" });
  }
};
