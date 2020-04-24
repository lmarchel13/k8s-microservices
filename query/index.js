const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

// Post with comments
const store = {};

const handleEvent = ({ type, payload }) => {
  switch (type) {
    case 'POST_CREATED':
      store[payload.id] = { ...payload, comments: [] };
      break;
    case 'COMMENT_CREATED':
      const { comments = [] } = store[payload.postId];
      comments.push(payload);
      store[payload.postId].comments = comments;
      break;
    case 'COMMENT_UPDATED':
      const post = store[payload.postId];
      const comment = post.comments.find(
        (comment) => comment.id === payload.id
      );

      comment.status = payload.status;
      comment.content = payload.content;

      break;
    default:
      break;
  }
  //
};

app.get('/posts', (req, res) => {
  res.send(store);
});

app.post('/events', (req, res) => {
  const { type, payload } = req.body;

  handleEvent({ type, payload });

  res.send({});
});

app.listen(4002, async () => {
  console.log('[QUERY] Listening on port 4002');

  const { data } = await axios.get('http://event-bus-service:4005/events');

  data.forEach((event) => {
    console.log('PROCESSING EVENT', event.type);
    handleEvent(event);
  });
});
