const Sequelize = require('sequelize')
const db = require('../db')

module.exports = db.define('category', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})
