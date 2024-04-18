FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install @influxdata/influxdb-client

COPY . .

CMD ["node", "index.js"]
