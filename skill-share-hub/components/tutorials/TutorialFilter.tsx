import { CATEGORY_LABELS, type TutorialCategory } from '@/lib/categories';

type TutorialFilterProps = {
  category: string;
  setCategory: (value: string) => void;
  categories: string[];
};

// "All" and any category not in the shared list (e.g. older data) fall back
// to showing the raw value.
function labelFor(cat: string): string {
  return CATEGORY_LABELS[cat as TutorialCategory] ?? cat;
}

export default function TutorialFilter({
  category,
  setCategory,
  categories,
}: TutorialFilterProps) {
  return (
    <select
      aria-label="Filter by category"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="border p-2 rounded"
    >
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {labelFor(cat)}
        </option>
      ))}
    </select>
  );
}
