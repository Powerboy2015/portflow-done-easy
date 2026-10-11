import { useCallback, useState } from "react";
import type { Post } from "../types";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  // Session-only, newest first. Returns false when there is nothing to post
  // (js-early-exit).
  const addPost = useCallback((text: string, tags: ReadonlySet<string>) => {
    const trimmed = text.trim();
    if (trimmed.length === 0) return false;
    const post: Post = {
      id: Date.now(),
      text: trimmed,
      tags: [...tags],
      createdAt: new Date(),
    };
    setPosts((prev) => [post, ...prev]);
    return true;
  }, []);

  return { posts, addPost };
}
