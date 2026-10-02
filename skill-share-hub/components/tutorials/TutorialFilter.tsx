type TutorialFilterProps = {
  category: string;
  setCategory: (value: string) => void;
  categories: string[];
};

export default function TutorialFilter({
  category,
  setCategory,
  categories,
}: TutorialFilterProps) {
  return (
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="border p-2 rounded"
    >
      {categories.map((cat) => (
        <option
          key={cat}
          value={cat}
        >
          {cat}
        </option>
      ))}
    </select>
  );
}