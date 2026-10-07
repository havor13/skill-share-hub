import Link from "next/link";

type TutorialPreview = {
  title: string;
  description: string;
  author: string;
};

type Category = {
  key: "coding" | "cooking" | "design";
  label: string;
  accentVar: string;
  tutorials: TutorialPreview[];
};

const categories: Category[] = [
  {
    key: "coding",
    label: "Coding",
    accentVar: "var(--color-primary)",
    tutorials: [
      {
        title: "Flexbox Layouts in 10 Minutes",
        description:
          "A quick, practical intro to CSS Flexbox for building responsive layouts without the guesswork.",
        author: "Ava Chen",
      },
      {
        title: "Debugging Async/Await Like a Pro",
        description:
          "Common pitfalls with async/await in JavaScript and how to fix them fast.",
        author: "Ava Chen",
      },
    ],
  },
  {
    key: "cooking",
    label: "Cooking",
    accentVar: "var(--color-secondary)",
    tutorials: [
      {
        title: "One-Pan Garlic Butter Shrimp",
        description: "A 20-minute weeknight dinner that only dirties one pan.",
        author: "Marcus Oduya",
      },
      {
        title: "Knife Skills Every Beginner Needs",
        description:
          "Master the basic cuts — dice, julienne, chiffonade — with confidence.",
        author: "Marcus Oduya",
      },
    ],
  },
  {
    key: "design",
    label: "Design",
    accentVar: "var(--color-accent)",
    tutorials: [
      {
        title: "Color Theory for UI Designers",
        description: "How to pick a palette that feels intentional instead of random.",
        author: "Priya Nair",
      },
      {
        title: "Figma Auto Layout, Explained Simply",
        description:
          "Stop fighting Figma's Auto Layout — here's the mental model that makes it click.",
        author: "Priya Nair",
      },
    ],
  },
];

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
      }}
    >
      {/* Hero */}
      <section className="px-6 py-10 sm:px-10 sm:py-12">
        <div className="max-w-2xl">
          <h1
            className="text-[44px] leading-[1.1] sm:text-[56px]"
            style={{
              fontFamily: "var(--font-fraunces), ui-serif, Georgia, serif",
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            Learn a skill from someone who&apos;s already good at it.
          </h1>
          <p
            className="mt-6 max-w-md text-[17px] leading-7"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            Short, practical tutorials from people who actually do the work —
            in code, in the kitchen, and at the design desk.
          </p>
          <div className="mt-9 flex items-center gap-4">
            <Link
              href="/signup"
              className="px-5 py-3 text-[15px] font-medium transition-colors"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-primary-foreground)",
              }}
            >
              Start learning
            </Link>
            <Link
              href="/tutorials"
              className="text-[15px] font-medium underline underline-offset-4"
            >
              Browse tutorials
            </Link>
          </div>
        </div>
      </section>

      {/* Category shelves */}
      <main className="px-6 pb-24 sm:px-10">
        {categories.map((category) => (
          <section key={category.key} className="mb-16">
            <div className="mb-5 flex items-center gap-3">
              <span
                aria-hidden
                className="inline-block h-3 w-3"
                style={{ backgroundColor: category.accentVar }}
              />
              <h2
                className="text-[13px] font-medium"
                style={{ color: "var(--color-muted-foreground)" }}
              >
                {category.label}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {category.tutorials.map((tutorial) => (
                <article
                  key={tutorial.title}
                  className="p-6"
                  style={{
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  <h3 className="text-[16px] font-semibold leading-6">
                    {tutorial.title}
                  </h3>
                  <p
                    className="mt-2 text-[14px] leading-6"
                    style={{ color: "var(--color-muted-foreground)" }}
                  >
                    {tutorial.description}
                  </p>
                  <p
                    className="mt-4 text-[13px]"
                    style={{ color: "var(--color-muted-foreground)" }}
                  >
                    By {tutorial.author}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer
        className="px-6 py-8 text-[13px] sm:px-10"
        style={{
          borderTop: "1px solid var(--color-border)",
          color: "var(--color-muted-foreground)",
        }}
      >
        Skill Share Hub — a place to teach what you know.
      </footer>
    </div>
  );
}
