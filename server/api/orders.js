const router = require('express').Router()
const {Op} = require('sequelize')
const {Order, Product, OrderItem} = require('../db/models')
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

router.put('/purchase', async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.body.orderId, {
      include: [{model: Product}]
    })
    //if an order is already past cartNotEmpty or if it is empty, respond with an error
    if (order.status !== 'cartNotEmpty') {
      const error = new Error('Server Error')
      error.status = 500
      return next(error)
    }
    //checks if the current user is the real owner of the order
    if (order.userId === req.user.id) {
      //checks inventory to see if the requested quantities are available
      for (let product of order.products) {
        const actualProduct = await Product.findByPk(product.id)
        if (actualProduct.inventory < product.orderItems.quantity) {
          const error = new Error('Server Error')
          error.status = 500
          return next(error)
        }
      }

      //change inventory to reflect purchase
      for (let product of order.products) {
        const actualProduct = await Product.findByPk(product.id)
        await Product.update(
          {
            inventory: actualProduct.inventory - product.orderItems.quantity
          },
          {
            where: {
              id: actualProduct.id
            }
          }
        )
      }
      // set list price of purchased items so that history is not affected by changing prices
      // for (let product of order.products) {
      //   await OrderItem.update({
      //     purchasePrice: product.price
      //   }, {
      //     where: {
      //       orderId: req.body.orderId,
      //       productId: product.id
      //     }
      //   })
      // }

      //finally, update order status to purchased
      await Order.update(
        {
          status: 'purchased',
          shippingInfo: req.body.address
        },
        {
          where: {
            id: req.body.orderId
          }
        }
      )
      res.status(200)
    } else {
      res.status(401).send('You are not the owner of this order')
    }
  } catch (err) {
    next(err)
  }
})
