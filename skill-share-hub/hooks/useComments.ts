// hooks/useComments.ts   (NEW)
'use client';

import { useEffect, useState } from 'react';

export type ApiComment = {
  _id: string;
  text: string;
  createdAt: string;
  user: { _id: string; name: string } | null;
};

async function fetchComments(tutorialId: string): Promise<ApiComment[]> {
  const res = await fetch(`/api/tutorials/${tutorialId}/comments`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load comments');
  const data = (await res.json()) as { comments: ApiComment[] };
  return data.comments;
}

export function useComments(tutorialId: string) {
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchComments(tutorialId)
      .then((list) => {
        if (!cancelled) {
          setComments(list);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Could not load comments.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tutorialId]);

  // Returns true when the comment was saved.
  async function addComment(text: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/tutorials/${tutorialId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (res.status === 401) {
        setError('Please log in to leave a comment.');
        return false;
      }
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(body?.error ?? 'Could not post your comment.');
        return false;
      }

      setComments(await fetchComments(tutorialId));
      setError(null);
      return true;
    } catch {
      setError('Could not post your comment.');
      return false;
    }
  }

  async function deleteComment(commentId: string): Promise<boolean> {
    try {
      const res = await fetch(
        `/api/tutorials/${tutorialId}/comments/${commentId}`,
        { method: 'DELETE' }
      );

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(body?.error ?? 'Could not delete the comment.');
        return false;
      }

      setComments(await fetchComments(tutorialId));
      setError(null);
      return true;
    } catch {
      setError('Could not delete the comment.');
      return false;
    }
  }

  return { comments, loading, error, addComment, deleteComment };
}
