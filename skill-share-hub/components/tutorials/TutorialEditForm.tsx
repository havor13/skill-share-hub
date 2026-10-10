// FILE: components/tutorials/TutorialEditForm.tsx — pre-filled edit form (new file)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORY_LABELS, TUTORIAL_CATEGORIES } from '@/lib/categories';

type TutorialEditFormProps = {
  tutorialId: string;
  initial: {
    title: string;
    description: string;
    category: string;
    contentUrl: string;
  };
};

export default function TutorialEditForm({
  tutorialId,
  initial,
}: TutorialEditFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/tutorials/${tutorialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.get('title'),
          description: formData.get('description'),
          category: formData.get('category'),
          contentUrl: formData.get('contentUrl'),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setError('You must be logged in to edit a tutorial.');
        } else if (res.status === 403) {
          setError('You can only edit your own tutorials.');
        } else {
          setError(data.error || 'Failed to update tutorial.');
        }
        setIsSubmitting(false);
        return;
      }

      router.push(`/tutorials/${tutorialId}`);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      {error && (
        <div role="alert" className="bg-red-100 text-red-800 p-2 rounded">
          {error}
        </div>
      )}

      <label htmlFor="title">Title</label>
      <input
        id="title"
        type="text"
        name="title"
        defaultValue={initial.title}
        className="border p-2 rounded"
        required
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        defaultValue={initial.description}
        className="border p-2 rounded"
        required
      />

      <label htmlFor="category">Category</label>
      <select
        id="category"
        name="category"
        defaultValue={initial.category}
        className="border p-2 rounded"
        required
      >
        {TUTORIAL_CATEGORIES.map((value) => (
          <option key={value} value={value}>
            {CATEGORY_LABELS[value]}
          </option>
        ))}
      </select>

      <label htmlFor="contentUrl">Tutorial Link</label>
      <input
        id="contentUrl"
        type="url"
        name="contentUrl"
        defaultValue={initial.contentUrl}
        className="border p-2 rounded"
        required
      />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/tutorials/${tutorialId}`)}
          className="text-blue-600 hover:underline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
