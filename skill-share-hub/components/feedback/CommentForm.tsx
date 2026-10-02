'use client';

import { useState } from 'react';

type CommentFormProps = {
  onAddComment: (comment: string) => void;
};

export default function CommentForm({ onAddComment }: CommentFormProps) {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!comment.trim()) {
      setError('Comment cannot be empty.');
      return;
    }

    setError('');
    onAddComment(comment);
    setComment('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 border rounded-lg p-4 shadow-sm"
    >
      <h2 className="text-xl font-semibold mb-4">
        Leave a Comment
      </h2>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border rounded p-2 mb-2"
        rows={3}
        placeholder="Write your comment..."
      />

      {error && (
        <p className="text-red-600 mb-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
}