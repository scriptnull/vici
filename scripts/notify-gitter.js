#!/usr/bin/env node

var https = require('https')
var url = require('url')
var querystring = require('querystring')

var payload = JSON.parse(process.argv[2])

var gitter = url.parse(payload.url)

var postData = querystring.stringify({
  message: payload.message
})

var options = {
  protocol: gitter.protocol,
  hostname: gitter.host,
  port: 443,
  path: gitter.path,
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
}

var req = https.request(options, (res) => {
  res.setEncoding('utf8')
  res.on('data', (chunk) => {
    console.log(chunk.toString())
  })
  res.on('end', () => {
    console.log('HTTP END')
  })
})

req.on('error', (e) => {
  console.error(e)
  process.exit(1)
})

// write data to request body
req.write(postData)
req.end()
