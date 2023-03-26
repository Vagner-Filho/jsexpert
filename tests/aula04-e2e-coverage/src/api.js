const http = require('http')

const DEFAULT_USER = {
  username: 'vagnerf',
  passwd: '123'
}

const { once } = require('events')

const routes = {
  '/contact:get': (req, res) => {
    res.write('contact us page')
    return res.end()
  },
  '/login:post': async (req, res) => {
    const data = await once(req, "data")
    console.log('data ', data)
    return res.end()
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