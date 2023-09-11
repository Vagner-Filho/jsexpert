const { describe, it, before, beforeEach, afterEach } = require('mocha')
const request = require('supertest');
const { expect } = require('chai')
const sinon = require('sinon')
const CarService = require('../../src/service/carService')
const { server } = require('../../src/view/server');

const mocks = {
  cars: require('../mocks/valid-car.json'),
  carCategory: require('../mocks/valid-carCategory.json'),
}

describe('Server test suite', () => {
  let sandbox = {};
  let cs = {};

  beforeEach(() => {
    cs = new CarService({ cars: mocks.cars });
    sandbox = sinon.createSandbox();
  })
  afterEach(() => {
    sandbox.restore();
  })

  it('returns status 400 if no carCategory is provided', async () => {

    sandbox.stub(
      cs,
      'getAvailableCar'
    ).resolves("successfull response");
    
    const response = await request(server)
      .get('/car')
      .send({})
    expect(response.status).to.be.equal(400);
  })

  it('returns status 200 if carCategory is provided', async () => {

    sandbox.stub(
      cs,
      'getAvailableCar'
    ).resolves("successfull response");
    
    const response = await request(server)
      .get('/car')
      .send(mocks.carCategory);
    expect(response.status).to.be.equal(200);
  })
})