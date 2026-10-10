// FILE: components/tutorials/TutorialActions.tsx — Edit/Delete buttons (new file)
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type TutorialActionsProps = {
  tutorialId: string;
};

// Rendered only for the tutorial's author or an admin (the page decides).
// The API enforces the same rule, so this is a convenience, not security.
export default function TutorialActions({ tutorialId }: TutorialActionsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      'Delete this tutorial? This cannot be undone.'
    );
    if (!confirmed) return;

    setError(null);
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/tutorials/${tutorialId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || 'Failed to delete tutorial.');
        setIsDeleting(false);
        return;
      }

      router.push('/tutorials');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setIsDeleting(false);
    }
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-4">
        <Link
          href={`/tutorials/${tutorialId}/edit`}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isDeleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-red-600 mt-2">
          {error}
        </p>
      )}
    </div>
  );
}
