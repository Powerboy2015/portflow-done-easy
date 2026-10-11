import { useCallback, useState } from "react";

// Stable empty default shared across resets; toggleTag always copies
// before mutating, so this instance is never mutated
// (rerender-memo-with-default-value).
const EMPTY_TAGS: ReadonlySet<string> = new Set();

export function useComposer() {
  const [text, setText] = useState("");
  const [tags, setTags] = useState<ReadonlySet<string>>(EMPTY_TAGS);

  // Derived during render, not in an effect (rerender-derived-state-no-effect).
  // Simple boolean — deliberately no useMemo (rerender-simple-expression-in-memo).
  const canSubmit = text.trim().length > 0;

  // Functional update keeps this callback stable across renders,
  // so memoized children receiving it skip re-renders
  // (rerender-functional-setstate).
  const toggleTag = useCallback((slug: string) => {
    setTags((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setText("");
    setTags(EMPTY_TAGS);
  }, []);

  return { text, tags, canSubmit, setText, toggleTag, reset };
}
