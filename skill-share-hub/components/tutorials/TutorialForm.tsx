'use client';

export default function TutorialForm() {
  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    alert('Tutorial submitted!');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-lg"
    >
      <input
        type="text"
        placeholder="Title"
        className="border p-2 rounded"
        required
      />

      <textarea
        placeholder="Description"
        className="border p-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Category"
        className="border p-2 rounded"
        required
      />

      <input
        type="url"
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