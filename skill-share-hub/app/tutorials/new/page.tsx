import Link from 'next/link';
import TutorialForm from '@/components/tutorials/TutorialForm';

export default function NewTutorialPage() {
  return (
    <main className="p-8">
      <Link href="/tutorials" className="text-blue-600 hover:underline mb-4 block">
        ← Back to Tutorials
      </Link>

      <h1 className="text-3xl font-bold mb-6">
        Publish Tutorial
      </h1>

      <TutorialForm />
    </main>
  );
}

