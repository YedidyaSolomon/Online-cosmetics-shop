import Cart from '../../models/cart.js'
import CartItem from '../../models/cartItems.js'
import Product from '../../models/products.js'


export const updateCartItems = async (req, res) => {
  try {
    const customer = req.customer
    const { items } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' })
    }

    // Find customer's active cart
    const cart = await Cart.findOne({
      where: { customer_id: customer.customer_id, status: 'active' }
    })

    if (!cart) {
      return res.status(404).json({ message: 'Active cart not found' })
    }

    // Process updates
    for (const item of items) {
      const { product_id, quantity } = item

      const existingItem = await CartItem.findOne({
        where: { cart_id: cart.cart_id, product_id }
      })

     
      if (!existingItem) continue

      if (quantity <= 0) {
        
        await existingItem.destroy()
        res.json({message:"item removed from the cart"})
      } else {
        // Otherwise update quantity and total price
        const product = await Product.findOne({ where: { product_id } })
        existingItem.quantity = quantity
        existingItem.price = product.price * quantity
        existingItem.updated_at = new Date()
        await existingItem.save()
      }
    }

    // Return updated cart
    const updatedCart = await CartItem.findAll({
      where: { cart_id: cart.cart_id },
      include: [{ model: Product, attributes: ['product_id', 'product_name', 'price'] }]
    })

    const formattedItems = updatedCart.map(item => ({
      product_id: item.Product.product_id,
      product_name: item.Product.product_name,
      quantity: item.quantity,
      price: item.price
    }))

    return res.status(200).json({
      message: 'Cart updated successfully',
      cart_id: cart.cart_id,
      updated_items: formattedItems
    })
  } catch (error) {
    console.error('Error updating cart:', error)
    return res.status(500).json({ message: 'Internal server error', error })
  }
}
