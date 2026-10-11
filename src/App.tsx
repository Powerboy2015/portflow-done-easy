import { useCallback, useRef, useState } from "react";
import "./App.css";
import { Composer } from "./components/Composer";
import { Feed } from "./components/Feed";
import { SettingsPanel } from "./components/SettingsPanel";
import { Sidebar } from "./components/Sidebar";
import { Titlebar } from "./components/Titlebar";
import { useComposer } from "./hooks/useComposer";
import { usePosts } from "./hooks/usePosts";
import type { View } from "./types";

function App() {
  const { text, tags, canSubmit, setText, toggleTag, reset } = useComposer();
  const { posts, addPost, removePost, isSaving, error } = usePosts();
  const [view, setView] = useState<View>("feed");
  const composerInputRef = useRef<HTMLTextAreaElement>(null);

  async function handleAddEntry() {
    const added = await addPost(text, tags);
    if (!added) return; // js-early-exit
    reset();
    setView("feed");
  }

  // Delete requires confirmation (ADR-005); the entry only disappears
  // when the backend confirms.
  const handleDeleteEntry = useCallback(
    (id: number) => {
      if (!window.confirm("Deze entry verwijderen?")) return;
      void removePost(id);
    },
    [removePost],
  );

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
              text={text}
              selectedTags={tags}
              canSubmit={canSubmit}
              inputRef={composerInputRef}
              onTextChange={setText}
              onToggleTag={toggleTag}
              onSubmit={handleAddEntry}
              isSaving={isSaving}
              error={error}
            />
            <Feed posts={posts} onDelete={handleDeleteEntry} />
          </>
        )}
      </main>
      </div>
    </div>
  );
}

export default App;
