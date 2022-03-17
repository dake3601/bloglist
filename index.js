const config = require('./utils/config')
const app = require('./app')
const http = require('http')
const { info } = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  info(`Server running on port ${config.PORT}`)
})
