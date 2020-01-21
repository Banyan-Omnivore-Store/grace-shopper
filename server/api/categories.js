const router = require('express').Router()
const {Category, Product} = require('../db/models')
module.exports = router

router.get('/all', async (req, res, next) => {
  try {
    const allCategories = await Category.findAll({
      include: [Product]
    })
    res.json(allCategories)
  } catch (err) {
    next(err)
  }
})

router.get('/:category', async (req, res, next) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.category
      }
    })
    console.log('category:', category)
    const assocProducts = category.getProducts()
    console.log('assoc prods:', assocProducts)
    res.json(assocProducts)
  } catch (err) {
    next(err)
  }
})
