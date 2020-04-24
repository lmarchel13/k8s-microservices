import React from 'react';
import PostCreate from './PostCreate';
import PostList from './PostList';

export default () => {
  return (
    <div className="container mt-5">
      <h1>Create a Post</h1>
      <PostCreate />
      <hr />
      <h3>Posts</h3>
      <PostList />
    </div>
  );
};
