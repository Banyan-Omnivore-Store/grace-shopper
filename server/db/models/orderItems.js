const Sequelize = require('sequelize')
const db = require('../db')

module.exports = db.define('orderItems', {
  quantity: {
    type: Sequelize.INTEGER,
    validate: {
      min: 1
    }
  }
})
