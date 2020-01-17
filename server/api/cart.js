/* eslint-disable max-statements */
/* eslint-disable complexity */
const router = require('express').Router()
const {Op} = require('sequelize')
const {Order, Product, OrderItem} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  if (!req.user) {
    if (!req.session.cart) {
      req.session.cart = {products: []}
    }
    res.send(req.session.cart)
  } else {
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
  }
})

router.put('/order/:orderId', async (req, res, next) => {
  if (!req.user) {
    try {
      const productId = req.body.productId
      const quantity = req.body.quantity
      const product = await Product.findOne({
        where: {id: productId}
      })
      let index = req.session.cart.products.reduce(
        (finalIndex, item, currentIndex) => {
          if (item.product.id === productId) {
            finalIndex = currentIndex
          }
          return finalIndex
        },
        -1
      )

      //if the product already exists in the cart index !==-1
      if (index !== -1) {
        //if the new desired quantity exceeds inventory, do not add, send error alert
        if (
          quantity + req.session.cart.products[index].quantity >
          product.inventory
        ) {
          res.send('item not added to cart, not enough inventory')
          //else there is enough space so add the quantity to existing cart count
        } else {
          req.session.cart.products[index].quantity =
            quantity + req.session.cart.products[index].quantity
          res.send('item added to cart')
        }
        //else if the product doesn't exist in the cart,
        //just check to see if the quantity being added > inventory
      } else if (quantity > product.inventory) {
        res.send('item not added to cart, not enough inventory')
      } else {
        req.session.cart.products.push({
          product: product,
          quantity: quantity
        })
        res.send('item added to cart')
      }
    } catch (err) {
      next(err)
    }
  } else {
    try {
      const order = await Order.findOne({
        where: {id: req.params.orderId},
        status: {
          [Op.or]: ['cartEmpty', 'cartNotEmpty']
        }
      })
      const prevQty = await OrderItem.findOne({
        where: {orderId: req.params.orderId, productId: req.body.productId}
      })

      const productId = req.body.productId
      const quantity = req.body.quantity
      const product = await Product.findOne({
        where: {id: productId}
      })

      if (prevQty) {
        if (parseInt(quantity, 10) + prevQty.quantity > product.quantity) {
          res.send('item not added to cart, not enough inventory')
          console.error('not enough inventory')
        }
        await order.addProduct(product, {
          through: {
            quantity: parseInt(quantity, 10) + prevQty.quantity
          }
        })
      } else {
        if (quantity > product.quantity) {
          res.send('item not added to cart, not enough inventory')
          console.error('not enough inventory')
        }
        await order.addProduct(product, {
          through: {
            quantity: quantity
          }
        })
        if (order.status === 'cartEmpty') {
          await order.update({status: 'cartNotEmpty'})
        }
      }
      res.send('item added to cart')
    } catch (err) {
      next(err)
    }
  }
})

router.put('/replace/:orderId', async (req, res, next) => {
  if (!req.user) {
    try {
      const productId = req.body.productId
      const quantity = req.body.quantity
      const product = await Product.findOne({
        where: {id: productId}
      })
      let index = req.session.cart.products.reduce(
        (finalIndex, item, currentIndex) => {
          if (item.product.id === productId) {
            finalIndex = currentIndex
          }
          return finalIndex
        },
        -1
      )

      //if the product already exists in the cart index !==-1 (it should b/c we're replacing qty)
      if (index !== -1) {
        //if the new desired quantity exceeds inventory, do not add, send error alert
        if (quantity > product.inventory) {
          res.send('item not added to cart, not enough inventory')
          //else there is enough space set the quantity as the new quantity
        } else {
          req.session.cart.products[index].quantity = quantity
          res.send('item added to cart')
        }
        //else if the product doesn't exist in the cart,
        //just check to see if the quantity being added > inventory
      }
    } catch (err) {
      next(err)
    }
  } else {
    try {
      const order = await Order.findOne({
        where: {id: req.params.orderId},
        status: {
          [Op.or]: ['cartEmpty', 'cartNotEmpty']
        }
      })
      const productId = req.body.productId
      const quantity = req.body.quantity
      const product = await Product.findOne({
        where: {id: productId}
      })
      if (quantity > product.quantity) {
        res.send('item not added to cart, not enough inventory')
        console.error('not enough inventory')
      } else {
        await order.addProduct(product, {
          through: {
            quantity: quantity
          }
        })
        res.send('item added to cart')
      }
    } catch (err) {
      next(err)
    }
  }
})

router.delete('/product', async (req, res, next) => {
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
