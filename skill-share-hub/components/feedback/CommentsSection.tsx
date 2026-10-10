// components/feedback/CommentsSection.tsx   (REPLACES existing file)
'use client';

import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { useComments } from '@/hooks/useComments';

type Props = {
  tutorialId: string;
};

export default function CommentsSection({ tutorialId }: Props) {
  const { comments, loading, error, addComment } = useComments(tutorialId);

  // CommentList expects { id: number, author, content }.
  const listItems = comments.map((c, index) => ({
    id: index + 1,
    author: c.user?.name ?? 'Unknown',
    content: c.text,
  }));

  function handleAddComment(content: string) {
    void addComment(content);
  }

  return (
    <>
      {loading && <p role="status">Loading comments...</p>}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {!loading && listItems.length === 0 && !error && (
        <p className="text-sm opacity-70">
          No comments yet. Be the first to comment.
        </p>
      )}

      <CommentList comments={listItems} />

      <CommentForm onAddComment={handleAddComment} />
    </>
  );
}
