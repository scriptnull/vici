# vici
[![Run Status](https://api.shippable.com/projects/57c3ab672c7f4e0e00a55c2d/badge?branch=master)](https://app.shippable.com/projects/57c3ab672c7f4e0e00a55c2d)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)]()
[![Docker Pulls](https://img.shields.io/docker/pulls/scriptnull/vici.svg?maxAge=2592000)](https://hub.docker.com/r/scriptnull/vici/)

Your webhook robot :ribbon:

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

### via docker
```bash
docker run -p 4454:4454 -e VICI_SECRET="top_secret_key" scriptnull/vici:latest
```

### Configure
You can tell vici to perform some action by sending HTTP requests. 


