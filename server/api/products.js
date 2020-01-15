const router = require('express').Router()
const {Product, Review} = require('../db/models')

module.exports = router

router.get('/all', async (req, res, next) => {
  try {
    const allProducts = await Product.findAll()
    res.json(allProducts)
  } catch (err) {
    next(err)
  }
})

router.get('/:productId', async (req, res, next) => {
  try {
    const singleProduct = await Product.findByPk(req.params.productId, {
      include: [
        {
          model: Review
        }
      ]
    })
    res.json(singleProduct)
  } catch (err) {
    next(err)
  }
})
