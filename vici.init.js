var vici = {}
vici.config = {}

// vici defaults
vici.defaults = {
  yml: {
    viciYmlPath: './vici.yml'
  },
  server: {
    viciPort: 4454,
    viciSecret: 'my_simple_vici_secret'
  }
}

// internal vici modules
vici.yml = require('./vici.yml.js')
vici.actionRoutes = require('./vici.actionRoute.js')
vici.server = require('./vici.server.js')

// libs
var _ = require('underscore')
var util = require('util')

// init vici
try {

  console.log('***************************************')
  console.log()
  console.log('Available Settings ( as environment variables )')
  console.log('-----------------------------------------------')
  console.log('VICI_YML_PATH - path to find the vici yml file')
  console.log('VICI_PORT     - port to be used for vici server')
  console.log('VICI_SECRET   - secret phrase to authenticate with vici')
  console.log()
  console.log('***************************************')

  vici.config.yml = {
    viciYmlPath: process.env.VICI_YML_PATH || vici.defaults.yml.viciYmlPath,
    callback: function (err, yml) {
      if (err) {
        throw err
      }

      vici.config.actionRoutes = {
        actionYmls: yml.actions,
        viciSecret: process.env.VICI_SECRET || vici.defaults.server.viciSecret,
        viciPort: process.env.VICI_PORT || vici.defaults.server.viciPort
      }

      vici.config.server = {
        viciPort: process.env.VICI_PORT || vici.defaults.server.viciPort,
        actionRoutes: vici.actionRoutes(vici.config.actionRoutes),
        callback: function (err, server) {
          if (err) {
            throw err
          }
          console.log('You can speak to vici now.')
          console.log('***************************************')
          console.log()
          console.log('vici yml path is ' + vici.config.yml.viciYmlPath)
          console.log('vici server running at ', server.info.uri)
          console.log('vici server secret is ' + vici.config.actionRoutes.viciSecret)
          console.log()
          console.log('Keep your secret safe. Otherwise, I will obey somebody.')
          console.log('I will be silent until you say the secret via ' +
            'x-vici-secret header or url query')
          console.log()
          console.log('***************************************')
        }
      }

      vici.server(vici.config.server)
    }
  }

  vici.yml(vici.config.yml)
} catch (err) {
  console.log(err)
  process.exit(1)
}
