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

router.put('/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId
    const order = await Order.findOne({
      where: {userId: userId},
      status: {
        [Op.or]: ['cartEmpty', 'cartNotEmpty']
      }
    })
    const productId = req.body.productId
    const quantity = req.body.quantity
    const product = await Product.findOne({
      where: {id: productId}
    })
    console.log(
      'userId:',
      userId,
      'productId:',
      productId,
      'quantity:',
      quantity
    )
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
