const BaseRepository = require('../repository/base/baseRepository');

class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars });
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
}

module.exports = CarService;