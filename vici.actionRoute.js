var _ = require('underscore')
var status = require('hapi-status')
var executors = {
  script: require('./vici.script.exec.js'),
  afterExec: require('./vici.after.exec.js')
}

module.exports = function (config) {
  return _.map(config.actionYmls, function (action) {
    return {
      method: action.method || 'POST',
      path: '/do/' + encodeURI(action.name),
      handler: function (request, reply) {
        var isAuth = _isSecretPresentInHeader(request, config.viciSecret) ||
          _isSecretPresentInQuery(request, config.viciSecret)

        if (!isAuth) {
          return status.unauthorized(reply, 'Authorization failed.')
        }

        action.on_success = _.map(action.on_success, function (action) {
          var url = 'http://localhost:' + config.viciPort + '/do/' + action.do
          return {
            url: url,
            method: action.method || 'POST',
            headers: {
              'x-vici-secret': config.viciSecret
            },
            payload: action.payload || {}
          }
        })

        action.on_failure = _.map(action.on_failure, function (action) {
          var url = 'http://localhost:' + config.viciPort + '/do/' + action.do
          return {
            url: url,
            method: action.method || 'POST',
            headers: {
              'x-vici-secret': config.viciSecret
            },
            payload: action.payload || {}
          }
        })

        executors.script({
          action: action,
          payload: request.payload,
          query: request.query,
          params: request.params,
          callback: function (exitCode) {
            // call outHooks here
            if (exitCode === 0 && !_.isEmpty(action.on_success)) {
              executors.afterExec(action.on_success)
            } else if (!_.isEmpty(action.on_failure)) {
              executors.afterExec(action.on_failure)
            }
          }
        })

        return status.ok(reply,
          'Webhook successfully triggered ' + action.name)
      }
    }
  })
}

function _isSecretPresentInHeader (request, secret) {
  return request.headers['x-vici-secret'] === secret
}

function _isSecretPresentInQuery (request, secret) {
  return request.query.secret === secret
}
