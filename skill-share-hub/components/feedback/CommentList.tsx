type Comment = {
  id: number;
  author: string;
  content: string;
};

const comments: Comment[] = [
  {
    id: 1,
    author: 'Sarah',
    content: 'Great tutorial!',
  },
  {
    id: 2,
    author: 'John',
    content: 'Very helpful explanation.',
  },
];

export default function CommentList() {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">
        Comments
      </h2>

      {comments.map((comment) => (
        <div
          key={comment.id}
          className="border rounded p-3 mb-3"
        >
          <p className="font-semibold">
            {comment.author}
          </p>

          <p>{comment.content}</p>
        </div>
      ))}
    </section>
  );
}