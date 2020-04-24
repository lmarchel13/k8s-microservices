const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const hosts = [
  'posts-clusterip-service:4000', // posts service
  'comments-service:4001', // comments service
  'query-service:4002', // query service
  'moderation-service:4003', // moderation service
];

const events = [];

app.get('/events', (req, res) => {
  res.send(events);
});

app.post('/events', (req, res) => {
  const event = req.body;
  events.push(event);
  console.log('NEW EVENT RECEIVED', event);

  hosts.forEach((host) => {
    axios.post(`http://${host}/events`, event);
  });

  res.send({ status: 'OK' });
});

app.listen(4005, () => {
  console.log('[EVENT-BUS] Running at port 4005');
});
