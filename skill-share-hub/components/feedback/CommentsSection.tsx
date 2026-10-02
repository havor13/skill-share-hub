'use client';

import { useState } from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

type Comment = {
  id: number;
  author: string;
  content: string;
};

const initialComments: Comment[] = [
  {
    id: 1,
    author: 'Sarah',
    content: 'Great tutorial!',
  },
  {
    id: 2,
    author: 'John',
    content: 'Very helpful explanation.',
  },
];

export default function CommentsSection() {
  const [comments, setComments] =
    useState(initialComments);

  function handleAddComment(content: string) {
    const newComment: Comment = {
      id: Date.now(),
      author: 'You',
      content,
    };

    setComments([...comments, newComment]);
  }

  return (
    <>
      <CommentList comments={comments} />

      <CommentForm
        onAddComment={handleAddComment}
      />
    </>
  );
}