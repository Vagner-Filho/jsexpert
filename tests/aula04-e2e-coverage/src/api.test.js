const { describe, it, after, before } = require('mocha')
const supertest = require('supertest')
const assert = require('assert')

describe('API Test Suite', () => {
  let app;

  before((done) => {
    app = require('./api.js')
    app.once('listening', done)
  })

  after(done => app.close(done))
  
  describe('/contact:get', () => {
    it('should request the contact route and return http status 200', async () => {
      const response = await supertest(app).get('/contact').expect(200)

      assert.strictEqual(response.text, 'contact us page')
    })
  })
  
  describe('/login:post', () => {
    it('should request the login route and return http status 200', async () => {
      const response = await supertest(app)
        .post('/login')
        .send({ username: 'VagnerF', passwd: '123' })
        .expect(200)

      assert.strictEqual(response.text, 'ok')
    })
  })
  
  describe('/login:post', () => {
    it('should request the login route and return http status 401', async () => {
      const response = await supertest(app)
        .post('/login')
        .send({ username: 'goiabinha', passwd: '1234' })
        .expect(401)

      assert.ok(response.unauthorized)
      assert.strictEqual(response.text, 'Bad Credentials')
    })
  })
  
  describe('/hi:get - 404', () => {
    it('should request non existing page and return 404', async () => {
      const response = await supertest(app)
        .get('/loginnn')
        .expect(404)
      assert.strictEqual(response.text, 'not found')
    })
  })
})