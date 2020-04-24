import React from 'react';

export default ({ comments }) => {
  const renderComments = comments.map((comment) => {
    const { status } = comment;

    switch (status) {
      case 'PENDING':
        return <li key={comment.id}>This comment is awaiting moderation</li>;
      case 'REJECTED':
        return <li key={comment.id}>This comment has been rejected</li>;
      default:
        return <li key={comment.id}>{comment.content}</li>;
    }
  });

  return <ul>{renderComments}</ul>;
};
