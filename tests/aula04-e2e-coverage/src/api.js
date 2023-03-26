const http = require('http')
const { once } = require('events')

const DEFAULT_USER = {
  username: 'vagnerf',
  passwd: '123'
}

const routes = {
  '/contact:get': (req, res) => {
    res.write('contact us page')
    return res.end()
  },
  '/login:post': async (req, res) => {
    const data = JSON.parse(await once(req, "data"))
    const toLowerCase = (string) => string.toLowerCase()
    if (
      toLowerCase(data.username) !== toLowerCase(DEFAULT_USER.username) ||
      data.passwd !== DEFAULT_USER.passwd
    ) {
      res.writeHead(401)
      res.end("Bad Credentials")
      return;
    }
    return res.end("ok")
  },
  default(req, res) {
    res.writeHead(404)
    return res.end('not found')
  }
}

function handler(req, res) {
  const { url, method } = req
  const routeKey = `${url}:${method.toLowerCase()}`
  const chosen = routes[routeKey] || routes.default
  return chosen(req, res)
}

const app = http.createServer(handler)
.listen(3000, () => console.log('running at 3000'))

// curl -X POST --data '{"username": "vagneRf", "passwd": "123"}' localhost:3000/login

module.exports = app