const Sequelize = require('sequelize')
const db = require('../db')

module.exports = db.define('product', {
  productName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.DECIMAL(10, 2)
  },
  inventory: {
    type: Sequelize.INTEGER,
    validate: {
      min: 0
    }
  },
  imageUrl: {
    type: Sequelize.STRING,
    defaultValue: '../../../public/oatmeal.jpg'
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  }
  //   productStatus: { //we are defaulting productStatus to false, so newly added products are not visible to the consumer unless otherwise specified
  //       type: Sequelize.BOOLEAN,
  //       defaultValue: false
  //   }
})
