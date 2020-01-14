const Sequelize = require('sequelize')
const db = require('../db')

module.exports = db.define('review', {
  rating: {
    type: Sequelize.INTEGER,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: Sequelize.TEXT
  }
})
