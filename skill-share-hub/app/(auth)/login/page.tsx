'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';

    setError('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setIsSubmitting(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password.');
      setIsSubmitting(false);
      return;
    }

    router.push('/tutorials');
    router.refresh();
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
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

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </main>
  );
}
