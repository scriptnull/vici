#!/usr/bin/env node

console.log('Executing script')
var payloadString = process.argv[2]
try {
  var payload = JSON.parse(payloadString)
  
} catch (err) {

}
