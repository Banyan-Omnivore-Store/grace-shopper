const router = require('express').Router()
const {Op} = require('sequelize')
const {Order, Product} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
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

router.put('/order/:orderId', async (req, res, next) => {
  //need to UPDATE THUNKS HERE from /add
  try {
    const orderId = req.params.orderId
    const order = await Order.findOne({
      where: {id: orderId},
      status: {
        [Op.or]: ['cartEmpty', 'cartNotEmpty']
      }
    })

    const productId = req.body.productId
    const quantity = req.body.quantity
    const product = await Product.findOne({
      where: {id: productId}
    })
    await order.addProduct(product, {
      through: {
        quantity: quantity
      }
    })
    res.send('item added to cart')
  } catch (err) {
    next(err)
  }
})

router.delete('/product', async (req, res, next) => {
  //UPDATE THUNK from /delete
  try {
    const productId = req.body.productId
    const orderId = req.body.orderId

    const order = await Order.findOne({
      where: {id: orderId},
      status: {
        [Op.or]: ['cartEmpty', 'cartNotEmpty']
      }
    })

    const product = await Product.findOne({
      where: {id: productId}
    })

    await order.removeProduct(product, {
      // through: {
      //   quantity: 0
      // }
    })
    res.send('item deleted from cart')
  } catch (err) {
    next(err)
  }
})
