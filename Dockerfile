FROM scriptnull/debian:docker.1.12.node.4.5.0

MAINTAINER Vishnu Bharathi "vishnubharathi04@gmail.com"

ADD . ./vici

WORKDIR ./vici

RUN ["npm", "install"]

CMD ["npm", "start"]
