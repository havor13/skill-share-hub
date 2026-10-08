// Single source of truth for tutorial categories. Safe to import from both
// client components (the form) and server code (the Mongoose model / API
// routes) because it has no dependencies.

export const TUTORIAL_CATEGORIES = [
  "coding",
  "cooking",
  "design",
  "music",
  "photography",
  "writing",
  "fitness",
  "languages",
  "business",
  "crafts",
  "gardening",
  "data-ai",
  "other",
] as const;

export type TutorialCategory = (typeof TUTORIAL_CATEGORIES)[number];

// Record<TutorialCategory, string> makes TypeScript error if a category is
// added above without a label here.
export const CATEGORY_LABELS: Record<TutorialCategory, string> = {
  coding: "Coding",
  cooking: "Cooking",
  design: "Design",
  music: "Music",
  photography: "Photography",
  writing: "Writing",
  fitness: "Fitness",
  languages: "Languages",
  business: "Business & Finance",
  crafts: "Crafts & DIY",
  gardening: "Gardening",
  "data-ai": "Data & AI",
  other: "Other",
};