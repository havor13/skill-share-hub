import Link from 'next/link';
import { CATEGORY_LABELS, type TutorialCategory } from '@/lib/categories';

type TutorialCardProps = {
  id: string;
  title: string;
  description: string;
  category: string;
  link: string;
};

export default function TutorialCard({
  id,
  title,
  description,
  category,
  link,
}: TutorialCardProps) {
  // Fall back to the raw value for any category not in the shared list.
  const categoryLabel = CATEGORY_LABELS[category as TutorialCategory] ?? category;

  return (
    <div className="border rounded p-4">
      <h2 className="text-xl font-semibold">{title}</h2>

      <p>{description}</p>

      <p className="text-sm text-gray-600">
        {categoryLabel}
      </p>
      <a href={link}  className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
        View Tutorial
      </a>
      <br />
      <Link href={`/tutorials/${id}`} className="text-blue-600 hover:underline">
        View Details
      </Link>
    </div>
  );
}
