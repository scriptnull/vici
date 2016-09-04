var child_process = require('child_process')
var spawn = child_process.spawn

module.exports = function (config) {
  console.log('=======================================')
  console.log('Executing ' + config.action.name)
  console.log('=======================================')
  var actionSpawn = spawn(config.action.script,
    [
      JSON.stringify(config.payload || {}),
      JSON.stringify(config.query || {}),
      JSON.stringify(config.params || {})
    ])

  actionSpawn.stdout.on('data', function (data) {
    console.log(data.toString())
  })

  actionSpawn.stderr.on('data', function (data) {
    console.error(data.toString())
  })

  actionSpawn.on('close', function (code) {
    console.log(config.action.name + ': Exited with Code ' + code)
    console.log('=======================================')
    config.callback(code)
  })
}
