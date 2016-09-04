var vici = {}
vici.yml = require('../vici.yml.js')
var assert = require('assert')
var _ = require('underscore')

describe('vici.yml module', function () {
  it('should return err for invalid path', function (done) {
    var config = {
      viciYmlPath: '/invalid/path',
      callback: function (err, result) {
        assert.equal(!!err, true)
        assert.equal(!!result, false)
        return done()
      }
    }
    vici.yml(config)
  })

  it('should fail for empty path yml', function (done) {
    var config = {
      viciYmlPath: '/home/scriptnull/github/vici/tests/data/empty.vici.yml',
      callback: function (err, result) {
        if (err) {
          return done()
        }

        return done('empty yml case not handled properly')
      }
    }
    vici.yml(config)
  })

  it('should pass for valid path yml', function (done) {
    var config = {
      viciYmlPath: '/home/scriptnull/github/vici/tests/data/valid.vici.yml',
      callback: function (err, result) {
        if (err) {
          return done(err)
        }

        if (_.isEmpty(result)) {
          return done('empty result returned back by yml parser')
        }

        if (!_.isArray(result.actions)) {
          return done('expects actions to be an array')
        }

        return done()
      }
    }
    vici.yml(config)
  })

  it('should fail for invalid actions format in yml', function (done) {
    var config = {
      viciYmlPath: '/home/scriptnull/github/vici/tests/data/invalid-actions.vici.yml',
      callback: function (err, result) {
        if (err) {
          return done()
        }

        return done('invalid actions array format not handled properly')
      }
    }
    vici.yml(config)
  })

})
