'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';

    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setSuccess('Login successful!');
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Login
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md"
      >
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
        />

        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-600">
            {success}
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </main>
  );
}
 