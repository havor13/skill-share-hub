'use client';
import { useState } from 'react';

export default function TutorialForm() {
const [successMessage, setSuccessMessage] = useState<string | null>(null);

function handleSubmit(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const title = formData.get('title');
  const description = formData.get('description');
  const category = formData.get('category');
  const contentUrl = formData.get('contentUrl');

  console.log({
    title,
    description,
    category,
    contentUrl,
  });

  event.currentTarget.reset();

  // TODO: POST /api/tutorials

  setSuccessMessage('Tutorial submitted successfully!');
}

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-lg"
    > 
      {successMessage && (
        <div className="bg-green-100 text-green-800 p-2 rounded">
          {successMessage}
        </div>
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
        className="bg-blue-600 text-white p-2 rounded"
      >
        Publish Tutorial
      </button>
    </form>
  );
}