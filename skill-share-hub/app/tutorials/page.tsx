'use client';
import Link from 'next/link';
import { useState } from 'react';
import { tutorials } from '@/data/tutorials';
import TutorialCard from '@/components/tutorials/TutorialCard';
import TutorialSearch from '@/components/tutorials/TutorialSearch';
import TutorialFilter from '@/components/tutorials/TutorialFilter';

export default function TutorialsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = [
    'All',
    ...new Set(tutorials.map((tutorial) => tutorial.category)),
  ];

  const filteredTutorials = tutorials.filter(
    (tutorial) =>
      (category === 'All' ||
        tutorial.category === category) &&
      (
        tutorial.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        tutorial.description
          .toLowerCase()
          .includes(search.toLowerCase())
      )
  );

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Tutorials
      </h1>
        <div className="mb-6">
            <Link href="/tutorials/new" className="text-blue-600 hover:underline">Add Tutorial</Link>
        </div>
      <div className="flex flex-wrap gap-4 mb-6">
        <TutorialSearch
            search={search}
            setSearch={setSearch}
        />

        <TutorialFilter
            category={category}
            setCategory={setCategory}
            categories={categories}
        />
        </div>

      <div className="flex flex-col gap-4">
        {filteredTutorials.length === 0 ? (
          <p role="status">No tutorials found.</p>
        ) : (
          filteredTutorials.map((tutorial) => (
            <TutorialCard
              key={tutorial.id}
              title={tutorial.title}
              description={tutorial.description}
              category={tutorial.category}
              link={tutorial.link}
            />
          ))
        )}
      </div>
    </main>
  );
}