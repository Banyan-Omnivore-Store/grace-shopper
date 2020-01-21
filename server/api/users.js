const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.put('/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId)
    if (req.user.id === user.id) {
      await user.update(req.body, {
        where: {
          id: user.id
        }
      })
      res.sendStatus(200)
    } else {
      res.status(401).send('Forbidden')
    }
  } catch (err) {
    next(err)
  }
})
