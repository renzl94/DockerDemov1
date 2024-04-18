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
  const point = new Point('random_measure')
    .floatField('value', Math.random());
  writeApi.writePoint(point);
  console.log('Writing point:', point.toLineProtocol());
}

// Write random data every 5 seconds
setInterval(generateRandomData, 5000);

// Flush data and close properly
process.on('SIGINT', () => {
  writeApi
    .close()
    .then(() => {
      console.log('Flushing data and exiting');
      process.exit(0);
    })
    .catch(e => console.error(e));
});
