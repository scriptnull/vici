# vici

[![Join the chat at https://gitter.im/scriptnull/vici](https://badges.gitter.im/scriptnull/vici.svg)](https://gitter.im/scriptnull/vici?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Run Status](https://api.shippable.com/projects/57c3ab672c7f4e0e00a55c2d/badge?branch=master)](https://app.shippable.com/projects/57c3ab672c7f4e0e00a55c2d)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)]()
[![Docker Pulls](https://img.shields.io/docker/pulls/scriptnull/vici.svg?maxAge=2592000)](https://hub.docker.com/r/scriptnull/vici/)
[![vici](https://img.shields.io/badge/robot-vici-orange.svg)](https://github.com/scriptnull/vici)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Your webhook robot :ribbon:

> Named after vici ( Pronounced Vicky ) from [Small Wonder TV series](https://en.wikipedia.org/wiki/Small_Wonder_(TV_series)).

# Install

### via git
```bash
# with ssh
git clone git@github.com:scriptnull/vici.git

# with https
git clone https://github.com/scriptnull/vici.git

npm install

npm start
```

### via npm
```bash
npm install -g vici

# start vici
vici
```

### via docker
```bash
docker run -p 4454:4454 -e VICI_SECRET="top_secret_key" scriptnull/vici:latest
```

# Configure
`vici` is a web server, that can execute scripts for the action you instruct.

Actions can be configured by giving a special file called `vici.yml`.

```yml
actions:
  - name: echoHello
    script: "/scripts/echoHello.sh"
    
  - name: deploy-myapp
    script: "/scripts/deploy-myapp.sh"
```

The above `vici.yml` will give you a `POST /do/{action-name}` endpoint, which on requested will execute the script corresponding to that action.

All the action scripts receive 2 arguments.

1. `payload` - The payload sent in the request body.
2. `query` - The query parameters as JSON value.

```
POST /do/echoHello?key=value

{ "hello" : "world" }
```

```bash
# echoHello.js
echo "Hello world"
echo "payload is $1" 
echo "query is $2"
```

# Security
For now, all your requests to vici server must contain the VICI_SECRET as a  query parameter or header.

- query - `POST /do/echoHello?secret=my_simple_vici_secret`
- header - `X-VICI-SECRET : my_simple_vici_secret`

# Settings
vici settings can be changed by changing appropriate environment variables.

| Env | Usage | Defaults |
|-----|---------|--------|
| VICI_YML_PATH |  path to find the vici yml file | vici.yml inside vici repository |
| VICI_PORT     | port to be used for vici server | 4454 |
| VICI_SECRET   | secret phrase to authenticate with vici | my_simple_vici_secret |

# Advanced
### Handling success and failures
vici can execute some other actions specified in the yml, in case of success or failure of one action.

success and failure is determined by the exit code of the script provided in the action.

```yml
actions:
  - name: notify-gitter
    script: "/scripts/notify-gitter.js"
    
  - name: echoHello
    script: "/scripts/echoHello.sh"
    on_success:
      - do: notify-gitter
        payload:
          url: "https://gitter.im/some-webhook-url"
          message: "Executed echoHello successfully"
    on_failure:
      - do: notify-gitter
        payload:
          url: "https://gitter.im/some-webhook-url"
          message: "Failed to execute echoHello"
```

> __BONUS__ : [Script for notifying gitter](https://github.com/scriptnull/vici/blob/master/scripts/notify-gitter.js)

If `echoHello` is success, it will trigger the actions in `on_success` serially. In this case, only one action i.e. `notify-gitter`

`do` tag instructs vici to send a HTTP request to vici server. `payload` tag helps define payload to be sent in the HTTP request.

### docker - cooking
`scriptnull/vici` image is built on top of `debian` installed with `node.js`. So, you should be able to execute bash, python, node.js etc. scripts. If you are using `docker`, this gets even more fun. You can cook the flavour of vici, you want.

Dockerfile for cooking flavour of vici, that could exceute ruby scripts looks like this

```Dockerfile
FROM scriptnull/vici:latest

RUN apt-get install ruby-full -y
```

### docker - mounting scripts
Mount volumes from host, to provide vici.yml and scripts.
```bash
docker run -p 4454:4454 -v /scripts:/scripts scriptnull/vici:latest
```

### docker - mounting docker
Host's docker can be accessed from inside of vici, by mounting the docker sock.
```bash
docker run -p 4454:4454  -v /var/run/docker.sock:/var/run/docker.sock scriptnull/vici:latest
```
This is useful for cases, where vici is used to automate deployments via docker.


# Contributing
Always welcome.

# Thanks
Thanks for taking time to check `vici`. It means a lot to the project.

# Badge
If you are using vici in your stack, for automating deployments, remote execution etc. Support `vici` project by adding a badge in your project.

[![vici](https://img.shields.io/badge/robot-vici-orange.svg)](https://github.com/scriptnull/vici)

```
[![vici](https://img.shields.io/badge/robot-vici-orange.svg)](https://github.com/scriptnull/vici)
```
