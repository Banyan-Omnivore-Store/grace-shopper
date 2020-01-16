const Sequelize = require('sequelize')
const db = require('../db')

module.exports = db.define('orderItems', {
  quantity: {
    type: Sequelize.INTEGER,
    validate: {
      min: 1
    }
  },

  purchasePrice: {
    type: Sequelize.DECIMAL(10, 2)
  }
})
