var vici = {}
vici.http = require('../vici.http.js')

describe('vici.http module', function () {
  it('should have valid GET /', function (done) {
    var config = {
      method: 'GET',
      url: 'localhost:4454',
      headers: [
        {
          key: 'Content-Type',
          value: 'application/json'
        }
      ],
      callback: function (err, res) {
        if (err && !err.response) {
          // error connecting to the server
          return done(err)
        }

        if (err && err.response) {
          // http response had a error status code
          return done(err)
        }

        return done()
      }
    }
    vici.http(config)
  })
})
