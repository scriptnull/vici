var _ = require('underscore')
var status = require('hapi-status')
var executors = {
  script: require('./vici.script.exec.js')
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

        executors.script({
          action: action,
          query: request.query,
          params: request.params,
          payload: request.payload,
          callback: function (exitCode) {
            // call outHooks here
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
