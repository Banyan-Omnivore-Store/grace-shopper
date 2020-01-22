const request = require('supertest')
const {expect} = require('chai')
const db = require('../db')
const app = require('../index')

describe('cart api route', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('guest /api/cart', () => {
    it('GET /api/cart returns an empty guest cart', async () => {
      const res = await request(app)
        .get('/api/cart')
        .expect(200)

      expect(res.body).to.be.an('object')
      expect(res.body.products).to.be.an('array')
    })
  })
})
