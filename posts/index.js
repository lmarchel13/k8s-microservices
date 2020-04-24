const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  const post = { id, title };
  posts[id] = post;

  await axios.post('http://event-bus-service:4005/events', {
    type: 'POST_CREATED',
    payload: post,
  });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('EVENT RECEIVED', req.body);

  res.send({});
});

app.listen(4000, console.log('[POSTS - v0.0.4] Listening on port 4000'));
