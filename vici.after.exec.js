var _ = require('underscore')
var async = require('async')
var viciHttp = require('./vici.http.js')

module.exports = function (execArr) {
  async.series(
    _.map(execArr,
      function (action) {
        return function (next) {
          var config = {
            url: action.url,
            method: action.method,
            headers: action.headers,
            payload: action.payload,
            callback: function (err, resp) {
              if (err) {
                if (err) {
                  console.error('Error while requesting ' + action.url)
                  console.error(err)
                  return next(err)
                }
                console.log('TRIGGER ' + action.url + ' - SUCCESS.')
                next()
              }
            }
          }

          viciHttp(config)
        }
      }
    )
  )
}
