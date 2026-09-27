type TutorialSearchProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function TutorialSearch({
  search,
  setSearch,
}: TutorialSearchProps) {
  return (
    <input
      type="text"
      placeholder="Search tutorials"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border p-2 rounded mb-6 w-full max-w-md"
    />
  );
}