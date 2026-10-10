// app/tutorials/[id]/page.tsx  (DETAIL page)
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import Tutorial from '@/models/Tutorial';
import { isValidObjectId } from '@/lib/ApiResponse';
import { authOptions } from '@/lib/authOptions';
import { CATEGORY_LABELS } from '@/lib/categories';
import CommentsSection from '@/components/feedback/CommentsSection';
import RatingWidget from '@/components/feedback/RatingWidget';
import TutorialActions from '@/components/tutorials/TutorialActions';

// Always render on request so edits, deletes and ratings show up.
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TutorialDetailPage({ params }: Props) {
  const { id } = await params;

  if (!isValidObjectId(id)) notFound();

  await dbConnect();
  const tutorial = await Tutorial.findById(id).lean();
  if (!tutorial) notFound();

  const session = await getServerSession(authOptions);
  const isOwner =
    !!session?.user?.id && tutorial.author?.toString() === session.user.id;
  const isAdmin = session?.user?.role === 'admin';
  const canManage = isOwner || isAdmin;

  const categoryLabel =
    CATEGORY_LABELS[tutorial.category as keyof typeof CATEGORY_LABELS] ??
    tutorial.category;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/tutorials" className="text-sm underline">
        ← Back to tutorials
      </Link>

      <h1 className="mt-4 text-3xl font-bold">{tutorial.title}</h1>
      <p className="mt-1 text-sm opacity-70">{categoryLabel}</p>
      <p className="mt-4">{tutorial.description}</p>

      {tutorial.contentUrl && (
        <a
          href={tutorial.contentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block underline"
        >
          Open tutorial content
        </a>
      )}

      {canManage && <TutorialActions tutorialId={id} />}

      <section className="mt-8">
        <RatingWidget tutorialId={id} />
      </section>

      <section className="mt-8">
        <CommentsSection />
      </section>
    </main>
  );
}