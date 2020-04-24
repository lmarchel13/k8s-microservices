const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

const commentsByPostId = {};
const INITIAL_COMMENT_STATUS = 'PENDING';

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { id: postId } = req.params;
  const { content } = req.body;

  const comment = { id: commentId, content, status: INITIAL_COMMENT_STATUS };

  commentsByPostId[postId]
    ? commentsByPostId[postId].push(comment)
    : (commentsByPostId[postId] = [comment]);

  await axios.post('http://event-bus-service:4005/events', {
    type: 'COMMENT_CREATED',
    payload: {
      postId,
      ...comment,
    },
  });

  res.status(201).send(commentsByPostId[postId]);
});

app.post('/events', async (req, res) => {
  const { type, payload } = req.body;
  console.log('EVENT RECEIVED', type);

  switch (type) {
    case 'COMMENT_MODERATED':
      const comments = commentsByPostId[payload.postId] || [];
      const comment = comments.find((comment) => comment.id === payload.id);

      if (comment) {
        comment.status = payload.status;
      }

      await axios.post('http://event-bus-service:4005/events', {
        type: 'COMMENT_UPDATED',
        payload,
      });

      break;
    default:
      break;
  }

  res.send({});
});

app.listen(4001, console.log('[COMMENTS] Listening on port 4001'));
