import CommentsSection from '@/components/feedback/CommentsSection';
import RatingWidget from '@/components/feedback/RatingWidget';
import Link from 'next/link';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TutorialDetailsPage({ params }: Props) {
  const { id } = await params;

  const response = await fetch(
    `${process.env.NEXTAUTH_URL ?? 'http://localhost:3002'}/api/tutorials/${id}`,
    {
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    return <p>Tutorial not found.</p>;
  }

  const data = await response.json();
  const tutorial = data.tutorial;

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
          Category:
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm ml-2">
            {tutorial.category}
          </span>
        </p>
        <a href={tutorial.contentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        {tutorial.contentUrl}
          Visit Tutorial
        </a>
      </div>

      <RatingWidget tutorialId={id} />

      <CommentsSection />
    </main>
  );
}