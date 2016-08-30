// Initialization has following segments
// 1. Assemble configurations from yaml
// 2. initialize action queue
// 3. Start vici server

var _ = require('underscore')
var yaml = require('js-yaml')
var fs = require('fs')
var queue = require('queue')

try {
  var viciYmlPath = process.env.VICI_YML_PATH

  if (_.isEmpty(viciYmlPath)) {
    console.error('Missing env VICI_YML_PATH')
    process.exit(1)
  }

  var viciYmlContent = fs.readFileSync(viciYmlPath, 'utf8')

  var viciYml = yaml.safeLoad(viciYmlContent)

  // validate config
  if (_.isEmpty(viciYml)) {
    console.error('Missing config object')
    process.exit(1)
  }

  if (!_.isArray(viciYml.actions) ||
    _.isEmpty(viciYml.actions)) {
    console.error('config.actions should be a valid array')
    process.exit(1)
  }

  var actionErrors = []
  _.each(viciYml.actions,
    function (action) {
      if (_.isEmpty(action.name)) {
        actionErrors.push('action.name need for ' +
          JSON.stringify(action))
        return
      }

      if (_.isEmpty(action.script)) {
        actionErrors.push('action.script need for ' +
          JSON.stringify(action))
        return
      }
    }
  )

  if (!_.isEmpty(actionErrors)) {
    console.error('Error parsing actions - ' +
      JSON.stringify(actionErrors))
    process.exit(1)
  }

  // initialize queues
  var qOpts = {}
  if (process.env.VICI_ACTION_CONCURRENCY) {
    qOpts.concurrency = parseInt(process.env.VICI_ACTION_CONCURRENCY, 2)
  }

  if (process.env.VICI_ACTION_TIMEOUT) {
    qOpts.timeout = parseInt(process.env.VICI_ACTION_TIMEOUT, 2)
  }

  var q = queue(qOpts)

  var config = {
    viciYml: viciYml,
    q: q
  }

  require('./server.js')(config)
} catch (err) {
  console.error('Unable to initialize vici ' + err)
}
