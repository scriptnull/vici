FROM node:slim

MAINTAINER Vishnu Bharathi "vishnubharathi04@gmail.com"

ADD . ./vici

WORKDIR ./vici

RUN ["npm", "install"]

CMD ["npm", "start"]
