import type { Post } from "../types";
import { createEntry, deleteEntry, isTauri, listEntries } from "./entries";

// Storage backend contract for the feed. The hook owns state; backends
// only move data. Single mode decision point is getPostBackend below,
// so callers never branch on isTauri themselves.
export type PostBackend = {
  load: () => Promise<Post[]>;
  add: (text: string, tags: string[]) => Promise<Post>;
  remove: (id: number) => Promise<boolean>;
};

const tauriBackend: PostBackend = {
  load: () => listEntries(),
  add: (text, tags) => createEntry(text, tags),
  remove: (id) => deleteEntry(id),
};

const sessionBackend: PostBackend = {
  load: () => Promise.resolve([]),
  add: (text, tags) =>
    Promise.resolve({
      id: Date.now(),
      text,
      tags: [...tags],
      createdAt: new Date(),
    }),
  remove: () => Promise.resolve(true),
};

// Outside Tauri (browser dev) everything runs session-only. Module-level
// singletons: stable identity, no re-creation per render.
export function getPostBackend(): PostBackend {
  return isTauri() ? tauriBackend : sessionBackend;
}
