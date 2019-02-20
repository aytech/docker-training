const express = require('express');
const redis = require('redis');
const appPort = '8080';
const keyVisits = 'visits';

const app = express();
const client = redis.createClient();
client.set(keyVisits, 0);

app.get('/', (req, res) => {
  client.get(keyVisits, (err, visits) => {
    res.send(`Number of visits is ${visits}`);
    client.set(keyVisits, parseInt(visits) + 1);
  });
});

app.listen(appPort, () => {
  console.log(`Listening on port ${appPort}`);
});
