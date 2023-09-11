const { createServer } = require('node:http');
const cars = require('../../database/cars.json');
const CarService = require('../service/carService');

const cs = new CarService({ cars });

const mountRoute = (path, method) => {
  return path.toLowerCase() + ':' + method.toLowerCase();
}

const routes = new Map([
  ['/car:get', async (req, res) => {
    let carCategory = [];
    req.on('data', (data) => {
      carCategory.push(data)
    })
    req.on('end', async (data) => {
      if (!carCategory) {
        res.writeHead(400)
        res.end("car category missing")
        return;
      }
      
      carCategory = Buffer.concat(carCategory).toString();
      carCategory = JSON.parse(carCategory);

      if (!carCategory.carIds) {
        res.writeHead(400)
        res.end("carIds property missing")
        return;
      }
      console.log(carCategory)
      const result = await cs.getAvailableCar(carCategory)
      if (!result) {
        res.writeHead(404)
        res.end("No car available")
        return;
      }
      res.writeHead(200, {
        'Content-Type': 'application/json'
      })
      res.end(JSON.stringify(result))
      return;
    })
  }]
])

const server = createServer((req, res) => {
  const route = mountRoute(req.url, req.method);

  if (routes.has(route)) {
    const handler = routes.get(route);
    handler(req, res);
  }

}).listen(3000)
module.exports = { server }