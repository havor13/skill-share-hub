type Comment = {
  id: number;
  author: string;
  content: string;
};

type CommentListProps = {
  comments: Comment[];
};

export default function CommentList({
  comments,
}: CommentListProps) {
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