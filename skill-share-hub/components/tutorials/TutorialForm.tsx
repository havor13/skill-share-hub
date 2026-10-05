'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TutorialForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const title = formData.get('title');
    const description = formData.get('description');
    const category = formData.get('category');
    const contentUrl = formData.get('contentUrl');

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/tutorials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category, contentUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setError('You must be logged in to publish a tutorial.');
        } else {
          setError(data.error || 'Failed to publish tutorial.');
        }
        setIsSubmitting(false);
        return;
      }

      form.reset();
      // Send them to the listing page so they can actually see it —
      // router.refresh() ensures the listing re-fetches instead of showing
      // a stale cached version.
      router.push('/tutorials');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded">{error}</div>
      )}

      <label htmlFor="title">Title</label>
      <input
        id="title"
        type="text"
        name="title"
        placeholder="Title"
        className="border p-2 rounded"
        required
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        placeholder="Description"
        className="border p-2 rounded"
        required
      />

      <label htmlFor="category">Category</label>
      <select
        id="category"
        name="category"
        className="border p-2 rounded"
        required
      >
        <option value="">Select a category</option>
        <option value="coding">Coding</option>
        <option value="cooking">Cooking</option>
        <option value="design">Design</option>
      </select>

      <label htmlFor="contentUrl">Tutorial Link</label>
      <input
        id="contentUrl"
        type="url"
        name="contentUrl"
        placeholder="Tutorial Link"
        className="border p-2 rounded"
        required
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
      >
        {isSubmitting ? 'Publishing…' : 'Publish Tutorial'}
      </button>
    </form>
  );
}
