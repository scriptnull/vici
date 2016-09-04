FROM node:slim

MAINTAINER Vishnu Bharathi "vishnubharathi04@gmail.com"

COPY ./README.md ./README.md

ADD . ./vici

WORKDIR ./vici

RUN ["npm", "install"]

CMD ["npm", "start"]
