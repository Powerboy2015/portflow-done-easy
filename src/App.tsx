import { useRef, useState } from "react";
import "./App.css";
import { Composer } from "./components/Composer";
import { Feed } from "./components/Feed";
import { SettingsPanel } from "./components/SettingsPanel";
import { Sidebar } from "./components/Sidebar";
import { Titlebar } from "./components/Titlebar";
import type { Post, View } from "./types";

function App() {
  const [composerText, setComposerText] = useState("");
  const [composerTags, setComposerTags] = useState<ReadonlySet<string>>(new Set());
  const [posts, setPosts] = useState<Post[]>([]);
  const [view, setView] = useState<View>("feed");
  const composerInputRef = useRef<HTMLTextAreaElement>(null);

  // Derived during render, no effect/state (rerender-derived-state-no-effect).
  // Simple boolean — deliberately no useMemo (rerender-simple-expression-in-memo).
  const canSubmit = composerText.trim().length > 0;

  // Functional updates: stable without stale closures (rerender-functional-setstate).
  function handleToggleTag(slug: string) {
    setComposerTags((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }

  function handlePlaatsen() {
    const text = composerText.trim();
    if (text.length === 0) return; // js-early-exit
    const post: Post = {
      id: Date.now(),
      text,
      tags: [...composerTags],
      createdAt: new Date(),
    };
    // Session-only, newest first. No backend yet.
    setPosts((prev) => [post, ...prev]);
    setComposerText("");
    setComposerTags(new Set());
    setView("feed");
  }

  const isSettings = view === "settings";

  // Selecting "new" does something visible: show the composer and focus it.
  // rAF so focus also works when the composer just mounted (from settings).
  function handleSelect(next: View) {
    setView(next);
    if (next === "new") {
      requestAnimationFrame(() => {
        composerInputRef.current?.scrollIntoView({ block: "nearest" });
        composerInputRef.current?.focus({ preventScroll: true });
      });
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white font-mono leading-[1.4] text-black">
      <Titlebar />

      <div className="flex flex-1 max-sm:flex-col">
        <Sidebar view={view} onSelect={handleSelect} />

        <main className="mx-auto w-full max-w-[800px] flex-1 p-4">
        {isSettings ? (
          <SettingsPanel onBack={() => setView("feed")} />
        ) : (
          <>
            <Composer
              text={composerText}
              selectedTags={composerTags}
              canSubmit={canSubmit}
              inputRef={composerInputRef}
              onTextChange={setComposerText}
              onToggleTag={handleToggleTag}
              onSubmit={handlePlaatsen}
            />
            <Feed posts={posts} />
          </>
        )}
      </main>
      </div>
    </div>
  );
}

export default App;
