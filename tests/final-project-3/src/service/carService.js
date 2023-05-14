const BaseRepository = require('../repository/base/baseRepository');
const Tax = require('../entities/tax');
const Transaction = require('../entities/transaction')

class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars });
    this.taxBasedOnAge = Tax.taxesBasedOnAge;
    this.currencyFormat = Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  async getAvailableCar(carCategory) {
    const carId = await this.chooseRandomCar(carCategory);
    const car = await this.carRepository.find(carId);
    return car;
  }

  async getRandomPositinFromArray(list) {
    const listLength = list.length;
    return Math.floor(
      Math.random() * (listLength)
    )
  }

  async chooseRandomCar(carCategory) {
    const randomCarIndex = await this.getRandomPositinFromArray(carCategory.carIds);
    const carId = carCategory.carIds[randomCarIndex];

    return carId;
  }

  async calculateFinalPrice(customer, carCategory, numberOfDays) {
    const { age } = customer;
    const { price } = carCategory;
    const { then: tax } = this.taxBasedOnAge.find(
      tax => age >= tax.from && age <= tax.to
    )
    const finalPrice = ((tax * price) * numberOfDays);
    const formattedPrice = this.currencyFormat.format(finalPrice);

    return formattedPrice;
  }
  
  async rent(customer, carCategory, numberOfDays) {
    const car = await this.getAvailableCar(carCategory);
    const finalPrice = await this.calculateFinalPrice(customer, carCategory, numberOfDays);

    const today = new Date();
    today.setDate(today.getDate() + numberOfDays);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    const dueDate = today.toLocaleDateString('pt-BR', options);

    const transaction = new Transaction({
      customer,
      dueDate,
      car,
      amount: finalPrice,
    });
    
    return transaction;
  }  
}

module.exports = CarService;