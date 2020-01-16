'use strict'

const db = require('../server/db')
const {User, Product, Order, Review, Category} = require('../server/db/models')
const faker = require('faker/locale/en_US')

const makeUser = () => {
  const users = []
  for (let i = 0; i < 10; i++) {
    users.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: '123',
      userStatus: 'member',
      address: faker.address.streetAddress()
    })
  }
  for (let i = 0; i < 2; i++) {
    users.push({userStatus: 'guest'})
  }
  for (let i = 0; i < 2; i++) {
    users.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: '123',
      userStatus: 'admin',
      address: faker.address.streetAddress()
    })
  }
  return users
}

const makeProduct = () => {
  const products = []
  for (let i = 0; i < 200; i++) {
    products.push({
      productName: faker.commerce.productName(),
      price: faker.commerce.price(),
      inventory: faker.random.number(),
      imageUrl: faker.image.imageUrl(),
      description: faker.company.catchPhraseDescriptor()
    })
  }
  return products
}

const makeOrder = () => {
  const orders = []
  for (let i = 0; i < 10; i++) {
    orders.push({
      status: ['cartNotEmpty', 'purchased', 'shipped', 'delivered'][
        Math.floor(Math.random() * 4)
      ],
      shippingInfo: faker.address.streetAddress(),
      cartTotal: faker.commerce.price(),
      userId: i + 1
    })
  }

  orders.push({
    status: 'cartEmpty',
    userId: 12
  })

  return orders
}

const madeCategories = [
  {
    name: 'steel-cut oats'
  },
  {
    name: 'rolled oats'
  },
  {
    name: 'instant oats'
  },
  {
    name: 'oat bran'
  },
  {
    name: 'cbd oats'
  }
]

const makeReview = () => {
  const reviews = []
  for (let i = 0; i < 8; i++) {
    reviews.push({
      rating: Math.ceil(Math.random() * 5),
      comment: faker.company.catchPhrase(),
      userId: i + 1,
      productId: Math.ceil(Math.random() * 10)
    })
  }
  return reviews
}

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await User.bulkCreate(makeUser())
  const products = await Product.bulkCreate(makeProduct())
  const orders = await Order.bulkCreate(makeOrder())
  const reviews = await Review.bulkCreate(makeReview())
  const categories = await Category.bulkCreate(madeCategories)

  for (let i = 0; i < products.length; i++) {
    await products[i].addCategory(categories[Math.ceil(Math.random() * 5)])
  } //associating products w/ categories

  for (let i = 0; i < orders.length - 2; i++) {
    await orders[i].addProduct(
      products[Math.ceil(Math.random() * products.length)],
      {
        through: {
          quantity: 1
        }
      }
    )
  } //associating products w/ categories

  console.log(`seeded ${users.length} users`)
  console.log(`seeded ${products.length} products`)
  console.log(`seeded ${orders.length} orders`)
  console.log(`seeded ${reviews.length} reviews`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.

async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
