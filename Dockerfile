FROM node:slim

ADD . ./vici

WORKDIR ./vici

RUN ["npm", "install"]

CMD ["npm", "start"]
