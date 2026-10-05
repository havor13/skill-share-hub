'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import TutorialCard from '@/components/tutorials/TutorialCard';
import TutorialSearch from '@/components/tutorials/TutorialSearch';
import TutorialFilter from '@/components/tutorials/TutorialFilter';

type Tutorial = {
  _id: string;
  title: string;
  description: string;
  category: string;
  contentUrl: string;
};

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    let cancelled = false;

    async function loadTutorials() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const res = await fetch('/api/tutorials');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to load tutorials.');
        }

        if (!cancelled) {
          setTutorials(data.tutorials ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : 'Failed to load tutorials.'
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadTutorials();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = [
    'All',
    ...new Set(tutorials.map((tutorial) => tutorial.category)),
  ];

  const filteredTutorials = tutorials.filter(
    (tutorial) =>
      (category === 'All' || tutorial.category === category) &&
      (tutorial.title.toLowerCase().includes(search.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Tutorials</h1>
      <div className="mb-6">
        <Link href="/tutorials/new" className="text-blue-600 hover:underline">
          Add Tutorial
        </Link>
      </div>
      <div className="flex gap-4 mb-6">
        <TutorialSearch search={search} setSearch={setSearch} />
        <TutorialFilter
          category={category}
          setCategory={setCategory}
          categories={categories}
        />
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <p>Loading tutorials…</p>
        ) : loadError ? (
          <p className="text-red-600">{loadError}</p>
        ) : filteredTutorials.length === 0 ? (
          <p>No tutorials found.</p>
        ) : (
          filteredTutorials.map((tutorial) => (
            <TutorialCard
              key={tutorial._id}
              title={tutorial.title}
              description={tutorial.description}
              category={tutorial.category}
              link={tutorial.contentUrl}
            />
          ))
        )}
      </div>
    </main>
  );
}
