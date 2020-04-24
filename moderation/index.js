const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const EVENTS = {
  COMMENT_MODERATED: 'COMMENT_MODERATED',
  COMMENT_CREATED: 'COMMENT_CREATED',
};

const isCommentAllowed = (comment) => {
  return !comment.toLowerCase().includes('abc');
};

app.post('/events', async (req, res) => {
  const { type, payload } = req.body;

  console.log('EVENT RECEIVED', type);

  switch (type) {
    case EVENTS.COMMENT_CREATED:
      payload.status = isCommentAllowed(payload.content)
        ? 'APPROVED'
        : 'REJECTED';

      await axios.post('http://event-bus-service:4005/events', {
        type: EVENTS.COMMENT_MODERATED,
        payload,
      });

      break;
    default:
      break;
  }
});

app.listen(4003, console.log('[MODERATION] Running on port 4004'));
