// Gedeelde domeintypes — direct importeren, geen barrel-file (bundle-barrel-imports).

export type Post = {
  id: number;
  text: string;
  /** Competency-slugs uit competencies.ts, in gekozen volgorde. */
  tags: string[];
  createdAt: Date;
};

export type View = "feed" | "new" | "settings";
