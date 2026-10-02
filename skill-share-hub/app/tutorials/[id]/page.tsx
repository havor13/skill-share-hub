import CommentList from '@/components/feedback/CommentList';
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

      <h1 className="text-3xl font-bold mb-4">
        {tutorial.title}
      </h1>

      <p className="mb-4">
        {tutorial.description}
      </p>

      <p className="mb-4">
        Category: {tutorial.category}
      </p>

      <a
        href={tutorial.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        Visit Tutorial
      </a>

      <RatingWidget />

      <CommentList />
    </main>
  );
}