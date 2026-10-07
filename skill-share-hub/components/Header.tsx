'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-blue-600 text-white px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto gap-4">
        <Link href="/" className="text-xl font-bold">
          Skill Share Hub
        </Link>

        <nav className="flex flex-wrap justify-center gap-3 items-center">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/tutorials" className="hover:underline">
            Tutorials
          </Link>

          <Link href="/tutorials/new" className="hover:underline">
            New Tutorial
          </Link>
          {!session?.user ? (
            <>
            <Link href="/login" className="hover:underline">
                Login
            </Link>
            <Link href="/signup" className="hover:underline">
                Sign Up
            </Link> 
            </>    
          ) : (
            <button
                onClick={() => signOut()}
                className="bg-white text-blue-600 px-3 py-1 rounded"
            >
                Logout
            </button>
          )}       
        </nav>
      </div>
    </header>
  );
}