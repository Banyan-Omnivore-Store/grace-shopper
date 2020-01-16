const router = require('express').Router()
const {Op} = require('sequelize')
const {Order, Product} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  if (req.user) {
    try {
      const orders = await Order.findAll({
        where: {
          userId: req.user.id,
          status: {
            [Op.or]: ['purchased', 'shipped', 'delivered']
          }
        },
        include: [{model: Product}]
      })
      res.json(orders)
    } catch (err) {
      next(err)
    }
  } else {
    res.status(401).send('Unauthenticated user')
  }
})

router.get('/:orderId', async (req, res, next) => {
  if (req.user) {
    try {
      const order = await Order.findByPk(req.params.orderId, {
        include: [{model: Product}]
      })

      if (order.userId === req.user.id) {
        res.json(order)
      } else {
        res.status(401).send('Unauthenticated user')
      }
    } catch (err) {
      next(err)
    }
  } else {
    res.status(401).send('Unauthenticated user')
  }
})

router.put('/purchase', async (req, res, next) => {
  //req.body includes orderId, shipping and email
  try {
    let total = 0
    const order = await Order.findByPk(req.body.orderId, {
      include: [{model: Product}]
    })
    //if an order is already past cartNotEmpty or if it is empty, respond with an error
    if (order.status !== 'cartNotEmpty') {
      const error = new Error('Cart status error')
      error.status = 500
      return next(error)
    }
    //checks if the current user is the real owner of the order
    if (order.userId === req.user.id) {
      //checks inventory to see if the requested quantities are available
      for (let product of order.products) {
        const actualProduct = await Product.findByPk(product.id)
        if (actualProduct.inventory < product.orderItems.quantity) {
          const error = new Error('Not enough inventory to complete order')
          error.status = 500
          return next(error)
        }
      }

      //change inventory to reflect purchase and start adding price to get total
      for (let product of order.products) {
        const actualProduct = await Product.findByPk(product.id)
        total += Number(actualProduct.price)
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
      for (let product of order.products) {
        await OrderItem.update(
          {
            purchasePrice: product.price
          },
          {
            where: {
              orderId: req.body.orderId,
              productId: product.id
            }
          }
        )
      }

      //update order status to purchased
      await Order.update(
        {
          status: 'purchased',
          shippingInfo: req.body.address,
          cartSubtotal: Math.round(total * 100) / 100,
          cartTotal: Math.round(total * 107) / 100
        },
        {
          where: {
            id: req.body.orderId
          }
        }
      )

      const completedOrder = await Order.findByPk(req.body.orderId, {
        include: [{model: Product}]
      })
      // send updated order to display order confirmation
      res.status(200).json(completedOrder)
    } else {
      res.status(401).send('You are not the owner of this order')
    }
  } catch (err) {
    next(err)
  }
})
