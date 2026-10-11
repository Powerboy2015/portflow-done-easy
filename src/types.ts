// Shared domain types — import directly, no barrel file (bundle-barrel-imports).

export type Post = {
  id: number;
  text: string;
  /** Competency slugs from competencies.ts, in chosen order. */
  tags: string[];
  createdAt: Date;
};

export type View = "feed" | "new" | "settings";
