FROM node:8.11-alpine

WORKDIR /app

ADD package.json .
ADD yarn.lock .

RUN yarn

ADD . .

RUN yarn tsc

CMD [ "node", "dest/main.js" ]