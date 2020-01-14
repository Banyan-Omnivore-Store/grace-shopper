const Sequelize = require('sequelize')
const db = require('../db')

module.exports = db.define('order', {
  status: {
    type: Sequelize.ENUM(
      'cartEmpty',
      'cartNotEmpty',
      'purchased',
      'shipped',
      'delivered'
    ),
    defaultValue: 'cartEmpty',
    allowNull: false
  },
  shippingInfo: {
    type: Sequelize.STRING
  },
  couponCode: {
    type: Sequelize.STRING
  },
  cartSubtotal: {
    type: Sequelize.DECIMAL(10, 2)
  },
  cartTotal: {
    type: Sequelize.DECIMAL(10, 2)
  }
})

//should we calculate the cart total and subtotal here or in routes later?
