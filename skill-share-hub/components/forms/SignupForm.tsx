'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    const confirmPassword = formData.get('confirmPassword')?.toString() || '';

    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account.');
        setIsSubmitting(false);
        return;
      }

      // Account created — log them straight in.
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Account exists but auto-login failed for some reason; send them to
        // log in manually instead of leaving them stuck.
        router.push('/login');
        return;
      }

      router.push('/tutorials');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
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

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
      >
        {isSubmitting ? 'Creating account…' : 'Sign Up'}
      </button>
    </form>
  );
}
