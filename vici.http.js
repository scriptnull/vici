var _ = require('underscore')

module.exports = function (config) {
  var superagent = require('superagent')

  var request = superagent(
    config.method,
    config.url
  )

  _.each(config.headers,
    function (header) {
      request.set(header.key, header.value)
    }
  )

  if (!_.isEmpty(config.payload)) {
    request.send(config.payload)
  }

  request.end(config.callback)
}
