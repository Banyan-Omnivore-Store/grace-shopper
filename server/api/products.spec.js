const {expect} = require('chai')
const request = require('supertest')
const db = require('../db')

describe('Products routes', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('/api/products', () => {})
})
