const faker = require('faker');
const Car = require('../src/entities/car.js')
const CarCategory = require('../src/entities/carCategory.js')
const Customer = require('../src/entities/customer.js')

const { writeFile } = require('fs/promises')
const { join } = require('path')

const seederBaseFolder = join(__dirname, "../", "database")
const ITEMS_AMOUNT = 2

const carCategory = new CarCategory({
  id: faker.random.uuid(),
  name: faker.vehicle.type(),
  carIds: [],
  price: faker.finance.amount(20, 100)
})

const cars = []
const customers = []

for (let index = 0; index <= ITEMS_AMOUNT; index++) {
  const car = new Car({
    id: faker.random.uuid(),
    name: faker.vehicle.model(),
    available: true,
    gasAvailable: faker.date.past().getFullYear()
  })
  carCategory.carIds.push(car.id)
  cars.push(car)

  const customer = new Customer({
    id: faker.random.uuid(),
    name: faker.name.firstName(),
    age: faker.random.number({ min: 18, max: 50 })
  })

  customers.push(customer)
}

const write = (filename, data) => writeFile(join(seederBaseFolder, filename), JSON.stringify(data))

;(async () => {
  await write('cars.json', cars)
  await write('carCategories.json', [carCategory])
  await write('customers.json', customers)

  console.log(cars)
  console.log(carCategory)
  console.log(customers)
})()