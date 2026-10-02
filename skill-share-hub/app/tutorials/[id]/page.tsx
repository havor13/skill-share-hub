import CommentsSection from '@/components/feedback/CommentsSection';
import RatingWidget from '@/components/feedback/RatingWidget';
import { tutorials } from '@/data/tutorials';
import Link from 'next/link';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TutorialDetailsPage({ params }: Props) {
 const { id } = await params;

 const tutorial = tutorials.find(
  (tutorial) => tutorial.id === id
 );

  if (!tutorial) {
    return <p>Tutorial not found.</p>;
  }

  return (
    <main className="p-6">
      <Link href="/tutorials" className="text-blue-600 hover:underline">
        ← Back to Tutorials
      </Link>
     <div className="border rounded-lg p-6 mb-6 shadow-sm">
      <h1 className="text-3xl font-bold mb-4">
        {tutorial.title}
      </h1>

      <p className="mb-4">
        {tutorial.description}
      </p>

      <p className="mb-4">
        Category:<span className="bg-gray-100 px-3 py-1 rounded-full text-sm">{tutorial.category}</span> 
      </p>

      <a
        href={tutorial.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Visit Tutorial
      </a>
     </div>
      <RatingWidget />

    <CommentsSection />

    </main>
  );
}