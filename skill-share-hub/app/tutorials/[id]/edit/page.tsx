// FILE: app/tutorials/[id]/edit/page.tsx — EDIT PAGE (new file, new 'edit' folder)
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import Tutorial from '@/models/Tutorial';
import { isValidObjectId } from '@/lib/ApiResponse';
import TutorialEditForm from '@/components/tutorials/TutorialEditForm';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTutorialPage({ params }: Props) {
  const { id } = await params;

  if (!isValidObjectId(id)) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  await dbConnect();
  const tutorial = await Tutorial.findById(id).lean();

  if (!tutorial) {
    notFound();
  }

  const isOwner = tutorial.author.toString() === session.user.id;
  const isAdmin = session.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Not allowed</h1>
        <p className="mb-4">You can only edit tutorials you published.</p>
        <Link href={`/tutorials/${id}`} className="text-blue-600 hover:underline">
          ← Back to tutorial
        </Link>
      </main>
    );
  }

  return (
    <main className="p-8">
      <Link href={`/tutorials/${id}`} className="text-blue-600 hover:underline">
        ← Back to tutorial
      </Link>

      <h1 className="text-3xl font-bold mb-6">Edit Tutorial</h1>

      <TutorialEditForm
        tutorialId={id}
        initial={{
          title: tutorial.title,
          description: tutorial.description,
          category: tutorial.category,
          contentUrl: tutorial.contentUrl,
        }}
      />
    </main>
  );
}
