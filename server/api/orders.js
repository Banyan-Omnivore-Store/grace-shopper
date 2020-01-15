const router = require('express').Router()
const {Op} = require('sequelize')
const {Order, Product} = require('../db/models')
module.exports = router

router.get('/cart', async (req, res, next) => {
  try {
    const cart = await Order.findOrCreate({
      where: {
        userId: req.user.id,
        status: {
          [Op.or]: ['cartEmpty', 'cartNotEmpty']
        }
      },
      defaults: {
        status: 'cartEmpty'
      },
      include: [{model: Product}]
    })
    res.json(cart[0])
  } catch (err) {
    next(err)
  }
})

router.put('/:orderId', async (req, res, next) => {
  try {
    const orderId = req.params.orderId
    const order = await Order.findOne({
      where: {id: orderId}
    })
    const productId = '6'
    const quantity = 5
    const product = await Product.findOne({
      where: {id: productId}
    })
    await order.addProduct(product, {
      through: {
        quantity: quantity
      }
    })
    console.log('item adding to cart')
    res.send('item added to cart')
  } catch (err) {
    next(err)
  }
})
