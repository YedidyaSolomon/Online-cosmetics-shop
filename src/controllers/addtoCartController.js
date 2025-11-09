import Cart from '../../models/cart.js'
import CartItem from '../../models/cartItems.js'
import Product from '../../models/products.js'
import Customer from '../../models/customers.js'
import { getAvailableProductQuantity } from '../utils/availableQuantityInStock.js'

export const addItemsInCart = async (req, res) => {
  try {
    const customer = req.customer
    const { items } = req.body // array of { product_id, quantity }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' })
    }

    const customerData = await Customer.findOne({
      where: { customer_id: customer.customer_id }
    })
    if (!customerData) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    let cart = await Cart.findOne({
      where: { customer_id: customer.customer_id, status: 'active' }
    })

    if (cart) {
      if (new Date() > cart.expired_at) {
        cart.status = 'cancelled'
        await cart.save()
        // Create a new active cart since the existing one is expired
        cart = await Cart.create({
          customer_id: customer.customer_id,
          first_name: customerData.first_name,
          last_name: customerData.last_name,
          status: 'active',
          created_at: new Date(),
          expired_at: new Date(Date.now() + 2 * 60 * 1000)
        })
      }
    } else {
      // No active cart found, create a new one
      cart = await Cart.create({
        customer_id: customer.customer_id,
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        status: 'active',
        created_at: new Date(),
        expired_at: new Date(Date.now() + 2 * 60 * 1000)
      })
    }

    
   
    // Loop through each product
    for (const item of items) {
      const { product_id, quantity } = item

      const product = await Product.findOne({ where: { product_id } })
      if (!product) {
        console.warn(`Product ${product_id} not found, skipping`)
        continue
      }

      const availableQty = await getAvailableProductQuantity(product_id)

      if (availableQty < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${product.product_name}. Only ${availableQty} left in stock.`
        })
      }

      
      const existingItem = await CartItem.findOne({
        where: { cart_id: cart.cart_id, product_id }
      })

      if (existingItem) {
        existingItem.quantity = quantity
        existingItem.price = product.price * quantity
        await existingItem.save()
      } else {
        await CartItem.create({
          cart_id: cart.cart_id,
          product_id: product.product_id,
          quantity,
          price: product.price * quantity,
          created_at: new Date(),
          updated_at: new Date()
        })
      }
    }

    
    const cartItems = await CartItem.findAll({
      where: { cart_id: cart.cart_id },
      include: [
        {
          model: Product,
          attributes: ['product_id', 'product_name', 'price', 'status']
        }
      ]
    })

    const formattedItems = cartItems.map(item => ({
      product_id: item.Product.product_id,
      product_name: item.Product.product_name,
      unit_price: item.Product.price,
      quantity: item.quantity,
      status: item.Product.status
    }))

    return res.status(200).json({
      message: 'All items added to cart successfully',
      cart_id: cart.cart_id,
      added_by: `${customerData.first_name} ${customerData.last_name}`,
      items: formattedItems
    })
  } catch (error) {
    console.error('Error adding items to cart:', error)
    return res.status(500).json({ message: 'Internal server error', error })
  }
}
