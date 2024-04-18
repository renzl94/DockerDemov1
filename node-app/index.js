const { InfluxDB, Point } = require('@influxdata/influxdb-client');

// Environment variables
const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

// InfluxDB client
const client = new InfluxDB({ url, token });
const writeApi = client.getWriteApi(org, bucket);

function generateRandomData() {
  // generer random nummer mellom 1 and 100
  const randomInteger = Math.floor(Math.random() * 100) + 1;
  const point = new Point('random_measure')
    .intField('value', randomInteger); // Use intField to store integer values
  writeApi.writePoint(point);
  console.log('Writing point:', point.toLineProtocol());
}

// skriv random data hvert 5 sec
setInterval(generateRandomData, 5000);

// Flush 
process.on('SIGINT', () => {
  writeApi
    .close()
    .then(() => {
      console.log('Flushing data and exiting');
      process.exit(0);
    })
    .catch(e => console.error(e));
});

//  port forward regel for å nå fra edge
const http = require('http');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('docker is easy');
}).listen(8080);

console.log('Server running at http://localhost:8080/');
