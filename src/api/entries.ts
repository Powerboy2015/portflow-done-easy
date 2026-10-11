import { invoke } from "@tauri-apps/api/core";
import type { Post } from "../types";

// Backend `Entry` shape (camelCase): createdAt is epoch millis.
type EntryDto = {
  id: number;
  text: string;
  tags: string[];
  createdAt: number;
};

// Window APIs only exist inside Tauri; in the browser (vite dev) callers
// fall back to session-only state.
export function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

function toPost(entry: EntryDto): Post {
  return {
    id: entry.id,
    text: entry.text,
    tags: entry.tags,
    createdAt: new Date(entry.createdAt),
  };
}

// Lists live entries newest-first. Throws outside Tauri.
export async function listEntries(): Promise<Post[]> {
  const entries = await invoke<EntryDto[]>("list_entries");
  return entries.map(toPost);
}

// Stores a new entry with 0..n tags. Throws on blank text or DB failure.
export async function createEntry(text: string, tags: string[]): Promise<Post> {
  const entry = await invoke<EntryDto>("create_entry", { text, tags });
  return toPost(entry);
}

// Soft-deletes an entry. Resolves false when the id is unknown.
export async function deleteEntry(id: number): Promise<boolean> {
  return invoke<boolean>("delete_entry", { id });
}
