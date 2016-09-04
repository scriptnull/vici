var _ = require('underscore')
var yaml = require('js-yaml')
var fs = require('fs')

module.exports = function (config) {
  try {
    var viciYmlPath = config.viciYmlPath

    if (!config.callback) {
      throw new Error('Missing config.callback')
    }

    if (_.isEmpty(viciYmlPath)) {
      return config.callback('Missing config.viciYmlPath')
    }

    var viciYmlContent = fs.readFileSync(viciYmlPath, 'utf8')

    var viciYml = yaml.safeLoad(viciYmlContent)

    // validate config
    if (_.isEmpty(viciYml)) {
      return config.callback('vici yml is empty')
    }

    if (!_.isArray(viciYml.actions) ||
      _.isEmpty(viciYml.actions)) {
      return config.callback('actions should be a valid array')
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
      return config.callback('Error parsing actions - ' +
        JSON.stringify(actionErrors))
    }

    config.callback(null, viciYml)
  } catch (err) {
    config.callback(err)
  }
}
