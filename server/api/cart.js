/* eslint-disable max-statements */
/* eslint-disable complexity */
const router = require('express').Router()
const {Op} = require('sequelize')
const {User, Order, Product, OrderItem} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  // if user is a guest
  if (!req.user) {
    //if user is a guest and does not have an active session, initialize an empty cart on the session object
    if (!req.session.cart) {
      req.session.cart = {products: []}
    }
    //send guest their newly initilaized or existing cart
    res.json(req.session.cart)
    //if the user is a member
  } else {
    let cart
    try {
      cart = await Order.findOrCreate({
        where: {
          userId: req.user.id,
          status: 'cart'
        },
        include: [{model: Product}]
      })
    } catch {
      next(err)
    }
    cart = cart[0]
    if (req.session.cart) {
      if (req.session.cart.products.length > 0) {
        for (let elem of req.session.cart.products) {
          try {
            const product = await Product.findByPk(elem.product.id)
            await cart.addProduct(product, {
              through: {
                quantity: elem.quantity
              }
            })
          } catch (err) {
            next(err)
          }
        }
        delete req.session.cart
        res.json(cart)
      } else {
        delete req.session.cart
        res.json(cart)
      }
    } else {
      res.json(cart)
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
      let index
      if (!req.session.cart.products) {
        index = -1
      } else {
        index = req.session.cart.products.reduce(
          (finalIndex, item, currentIndex) => {
            if (item.product.id === productId) {
              finalIndex = currentIndex
            }
            return finalIndex
          },
          -1
        )
      }

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
        where: {id: req.params.orderId, status: 'cart'}
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
        where: {id: req.params.orderId, status: 'cart'}
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
      where: {id: orderId, status: 'cart'}
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
