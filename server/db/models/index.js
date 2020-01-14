const User = require('./user')
const Order = require('./order')
const Product = require('./product')
const OrderItem = require('./orderItems')
const Review = require('./reviews')
const Category = require('./category')

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

//if we get to extra credit we will set up models for coupons, deals, etc.

Order.belongsTo(User)
User.hasMany(Order)

Order.hasMany(OrderItem)
OrderItem.belongsTo(Order)
OrderItem.belongsTo(Product)
Product.hasMany(OrderItem)

Review.belongsTo(Product)
Product.hasMany(Review)
Review.belongsTo(User)
User.hasMany(Review)

Product.belongsToMany(Category, {
  through: 'productCategory'
})
Category.belongsToMany(Product, {
  through: 'productCategory'
})

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Order,
  Product,
  OrderItem,
  Review,
  Category
}
