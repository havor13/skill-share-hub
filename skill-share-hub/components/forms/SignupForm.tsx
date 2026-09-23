'use client';

import { useState } from 'react';

export default function SignupForm() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    const confirmPassword =
      formData.get('confirmPassword')?.toString() || '';

    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSuccess('Account created successfully!');
  }

  return (
    <form
      onSubmit={(e) => handleSubmit(e.nativeEvent as SubmitEvent)}
      className="flex flex-col gap-4 max-w-md"
    >
      <input
        name="name"
        type="text"
        placeholder="Full Name"
        className="border p-2 rounded"
      />

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

      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
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
        Sign Up
      </button>
    </form>
  );
}