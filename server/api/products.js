const router = require('express').Router()
const {Product, Review, User, Category} = require('../db/models')

module.exports = router

router.get('/all', async (req, res, next) => {
  try {
    const allProducts = await Product.findAll({
      include: [
        {
          model: Category
        }
      ]
    })
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
          model: Review,
          include: [
            {
              model: User
            }
          ]
        }
      ]
    })
    res.json(singleProduct)
  } catch (err) {
    next(err)
  }
})

//posting reviews route
router.post('/:productId/review/:userId', async (req, res, next) => {
  try {
    const review = req.body
    const newReview = await Review.create(review)
    res.json(newReview)
  } catch (err) {
    next(err)
  }
})
