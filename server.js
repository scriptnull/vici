'use strict'
module.exports = function (config) {
  var Hapi = require('hapi')
  var status = require('hapi-status')
  var _ = require('underscore')
  var child_process = require('child_process')
  var viciYml = config.viciYml
  var q = config.q
  var spawn = child_process.spawn
  var exec = child_process.exec

  // Create a server with a host and port
  var server = new Hapi.Server()
  server.connection({
    port: process.env.VICI_PORT
  })

  // Add the route
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
        return reply({
          package: require('./package.json')
        })
      }
    },
    {
      method: 'POST',
      path: '/webhook/{secretToken}',
      handler: function (request, reply) {
        var secretToken = decodeURI(request.params.secretToken)
        if (secretToken === process.env.VICI_SECRET_TOKEN) {
          var actionName = decodeURI(request.query.action)
          var actionList = _.filter(viciYml.actions,
            function (action) {
              return actionName === action.name
            }
          )

          if (_.isEmpty(actionList)) {
            return status.notFound(reply, 'Action for webhoook not found')
          }

          var actionTodo = _.first(actionList)

          q.push(function (cb) {
            var actionSpawn = spawn(actionTodo.script,
              [JSON.stringify(request.payload)])

            actionSpawn.stdout.on('data', function (data) {
              console.log(actionTodo.name + ': ' + data)
            })

            actionSpawn.stderr.on('data', function (data) {
              console.error(actionTodo.name + ': ' + data)
            })

            actionSpawn.on('close', function (code) {
              console.log(actionTodo.name + 'Exited with Code ' + code)
              cb()
            })
          })

          q.start(function (err) {
            if (err) {
              console.error(err)
            }
            console.log('Action done successfully.')
          })

          return status.ok(reply, 'Webhook processing successfully queued')
        }
      }
    }
  ]
  )

  // Start the server
  server.start(function (err) {
    if (err) {
      throw err
    }
    console.log('Server running at:', server.info.uri)
  })
}
