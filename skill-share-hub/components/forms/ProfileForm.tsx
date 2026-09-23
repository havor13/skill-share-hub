'use client';

export default function ProfileForm() {
  return (
    <form className="flex flex-col gap-4 max-w-md">
      <input
        type="text"
        placeholder="Display Name"
        className="border p-2 rounded"
      />

      <textarea
        placeholder="Tell us about yourself"
        className="border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded"
      >
        Save Profile
      </button>
    </form>
  );
}