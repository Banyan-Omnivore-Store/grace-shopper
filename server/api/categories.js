const router = require('express').Router()
const {Category, Product} = require('../db/models')
module.exports = router

router.get('/all', async (req, res, next) => {
  try {
    const allCategories = await Category.findAll({
      //   include: [{model: Product}]
    })
    res.json(allCategories)
  } catch (err) {
    next(err)
  }
})
