import { useCallback, useEffect, useState } from "react";
import { getPostBackend } from "../api/postBackend";
import type { Post } from "../types";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Single mode decision (Tauri vs session); stable singleton identity.
  const backend = getPostBackend();

  // Load persisted entries once. A backend failure surfaces as an error;
  // the session backend simply resolves to an empty list.
  useEffect(() => {
    backend
      .load()
      .then(setPosts)
      .catch(() => {
        setError("Kon entries niet laden.");
      });
  }, [backend]);

  // Newest first. Returns false when there is nothing to post
  // (js-early-exit) or the backend call fails.
  const addPost = useCallback(
    async (text: string, tags: ReadonlySet<string>): Promise<boolean> => {
      const trimmed = text.trim();
      if (trimmed.length === 0) return false;
      setIsSaving(true);
      setError(null);
      try {
        const post = await backend.add(trimmed, [...tags]);
        setPosts((prev) => [post, ...prev]);
        return true;
      } catch {
        setError("Opslaan mislukt, probeer het opnieuw.");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [backend],
  );

  // Soft-delete; the entry only disappears locally when the backend call
  // succeeds, so the list never drifts from storage.
  const removePost = useCallback(
    async (id: number): Promise<void> => {
      setError(null);
      try {
        await backend.remove(id);
      } catch {
        setError("Verwijderen mislukt, probeer het opnieuw.");
        return;
      }
      setPosts((prev) => prev.filter((post) => post.id !== id));
    },
    [backend],
  );

  return { posts, addPost, removePost, isSaving, error };
}
