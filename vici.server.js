'use strict'
module.exports = function (config) {
  var Hapi = require('hapi')

  // Create a server with a host and port
  var server = new Hapi.Server()
  var serverConfig = {
    port: config.viciPort
  }

  server.connection(serverConfig)

  // Add the route
  server.route(
    [
      {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
          return reply({
            package: require('./package.json')
          })
        }
      }
    ].concat(config.actionRoutes)
  )

  // Start the server
  server.start(function (err) {
    config.callback(err, server)
  })
}
