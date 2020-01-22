/* eslint-disable max-statements */
/* eslint-disable complexity */
const router = require('express').Router()
const {Op} = require('sequelize')
const {Order, Product, OrderItem, User} = require('../db/models')
const stripe = require('stripe')('sk_test_zsN4YCSbJveiJszcG6fk8RSH00voXhddzN')

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

router.get('/admin/all', async (req, res, next) => {
  if (req.user.userStatus === 'admin') {
    try {
      const orders = await Order.findAll({
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

      if (order.userId === req.user.id || req.user.userStatus === 'admin') {
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

//disabled max statements here but need to simplify
router.put('/purchase', async (req, res, next) => {
  //req.body includes orderId, shipping, email and token
  if (req.user) {
    try {
      let total = 0
      const order = await Order.findByPk(req.body.orderId, {
        include: [{model: Product}]
      })
      // console.log('member order:', order)
      //if an order is already past cartNotEmpty or if it is empty, respond with an error
      if (order.status !== 'cart') {
        const error = new Error('Error: Cart status error')
        error.status = 500
        return next(error)
      }
      //checks if the current user is the real owner of the order
      if (order.userId === req.user.id) {
        //checks inventory to see if the requested quantities are available
        for (let product of order.products) {
          const actualProduct = await Product.findByPk(product.id)
          if (actualProduct.inventory < product.orderItems.quantity) {
            const error = new Error(
              'Error: Not enough inventory to complete order. Please change quantities'
            )
            error.status = 500
            return next(error)
          }
        }

        //sends credit card information to stripe
        await stripe.charges.create({
          amount: 999,
          currency: 'usd',
          description: 'Example Charge',
          source: req.body.token,
          metadata: {order_id: req.body.orderId}
        })

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
            cartTax: Math.round(total * 7) / 100,
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
        res.status(401).send('Error: You are not the owner of this order')
      }
    } catch (err) {
      next(err)
    }
  }
})

router.put('/guestPurchase', async (req, res, next) => {
  //req.body includes shipping, email and token
  function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
  }

  try {
    let total = 0
    let products = req.session.cart.products
    //make a guestUser in the DB
    const guestUser = await User.create({
      firstName: 'GUEST FIRST',
      lastName: 'GUEST LAST',
      email: req.body.payment + getRandomInt(0, 90000),
      password: 'NA',
      userStatus: 'guest',
      address: req.body.address
    })
    //make a guestOrder in the db
    const guestOrder = await Order.create({
      status: 'cart',
      shippingInfo: req.body.shipping,
      cartTotal: 1000,
      userId: guestUser.id
    })

    for (let i = 0; i < req.session.cart.products.length; i++) {
      let currentProduct = await Product.findOne({
        where: {id: req.session.cart.products[i].product.id}
      })
      await guestOrder.addProduct(currentProduct, {
        through: {
          quantity: req.session.cart.products[i].quantity
        }
      })
    }
    // let firstProduct = await Product.findOne({
    //   where: {id: req.session.cart.products[0].product.id}
    // })

    // await guestOrder.addProduct(firstProduct, {
    //   through: {
    //     quantity: 20
    //   }
    // })

    //need to re-fetch the order with products included
    const order = await Order.findOne({
      where: {
        userId: guestUser.id,
        status: 'cart'
      },
      include: [{model: Product}]
    })
    //working, added products show up on re-found guest cart

    //associate guest cart items with orderItems
    //for each item in req.session.cart.products,
    // console.log('products', products)

    //if an order is already past cartNotEmpty or if it is empty, respond with an error
    if (order.status !== 'cart') {
      const error = new Error('Error: Cart status error')
      error.status = 500
      return next(error)
    }
    //no longer need to check if userId is real user, b/c it's a guest
    if (order) {
      //checks inventory to see if the requested quantities are available
      for (let product of order.products) {
        const actualProduct = await Product.findByPk(product.id)
        if (actualProduct.inventory < product.orderItems.quantity) {
          const error = new Error(
            'Error: Not enough inventory to complete order. Please change quantities'
          )
          error.status = 500
          return next(error)
        }
      }

      //sends credit card information to stripe
      await stripe.charges.create({
        amount: 999,
        currency: 'usd',
        description: 'Example Charge',
        source: req.body.token,
        metadata: {order_id: guestOrder.id}
      })

      //change inventory to reflect purchase and start adding price to get total
      for (let product of order.products) {
        const actualProduct = await Product.findByPk(product.id)
        total += Number(actualProduct.price) * product.orderItems.quantity
        //should we use parseFloat here?
        //one time I received an error that said SequelizeDatabaseError: numeric field overflow. Idk.
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
              orderId: guestOrder.id,
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
          cartTax: Math.round(total * 7) / 100,
          cartSubtotal: Math.round(total * 100) / 100,
          cartTotal: Math.round(total * 107) / 100
        },
        {
          where: {
            id: guestOrder.id
            //should we include cart status here? probably unecessary
          }
        }
      )

      req.session.cart = {products: []}

      const completedOrder = await Order.findByPk(guestOrder.id, {
        include: [{model: Product}]
      })
      // send updated order to display order confirmation
      res.status(200).json(completedOrder)
    } else {
      res.status(401).send('Error: You are not the owner of this order')
    }
  } catch (err) {
    next(err)
  }
})
