type TutorialCardProps = {
  title: string;
  description: string;
  category: string;
  link: string;
};

export default function TutorialCard({
  title,
  description,
  category,
  link,
}: TutorialCardProps) {
  return (
    <div className="border rounded p-4">
      <h2 className="text-xl font-semibold">{title}</h2>

      <p>{description}</p>

      <p className="text-sm text-gray-600">
        {category}
      </p>
      <a href={link} className="text-blue-600 hover:underline">
        View Tutorial
      </a>
    </div>
  );
}