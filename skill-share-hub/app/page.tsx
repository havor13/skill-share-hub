import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col w-full max-w-4xl items-center justify-center py-24 px-8 text-center sm:text-left">
        <Image
          src="/next.svg"
          alt="Skill Share Hub logo"
          width={120}
          height={40}
          priority
        />

        <h1 className="mt-8 text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
          Welcome to Skill Share Hub
        </h1>

        <p className="mt-4 max-w-xl text-lg leading-7 text-zinc-600 dark:text-zinc-400">
          A platform for sharing bite‑sized tutorials in coding, cooking, and design.
          Learn quickly, share your skills, and connect with others.
        </p>

        <div className="mt-8 flex gap-4">
          <a
            href="/auth/signup"
            className="rounded-full bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started
          </a>
          <a
            href="/tutorials/list"
            className="rounded-full border border-zinc-300 px-6 py-3 text-zinc-700 font-medium hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            Browse Tutorials
          </a>
        </div>
      </main>
    </div>
  );
}
