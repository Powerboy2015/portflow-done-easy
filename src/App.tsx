import { useCallback, useRef, useState } from "react";
import "./App.css";
import { Composer } from "./components/Composer";
import { ConfirmDialog } from "./components/ConfirmDialog";
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
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const composerInputRef = useRef<HTMLTextAreaElement>(null);

  async function handleAddEntry() {
    const added = await addPost(text, tags);
    if (!added) return; // js-early-exit
    reset();
    setView("feed");
  }

  // Delete requires confirmation (ADR-005) via a custom dialog — this is
  // an app, not a web page, so no window.confirm. The entry only
  // disappears when the backend confirms.
  const handleDeleteEntry = useCallback((id: number) => {
    setPendingDeleteId(id);
  }, []);

  const pendingPost =
    pendingDeleteId == null
      ? null
      : (posts.find((post) => post.id === pendingDeleteId) ?? null);

  const handleConfirmDelete = useCallback(() => {
    if (pendingDeleteId == null) return; // js-early-exit
    void removePost(pendingDeleteId);
    setPendingDeleteId(null);
  }, [pendingDeleteId, removePost]);

  const handleCancelDelete = useCallback(() => {
    setPendingDeleteId(null);
  }, []);

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

      {pendingPost ? (
        <ConfirmDialog
          title="[Entry verwijderen?]"
          body={
            pendingPost.text.length > 140
              ? `${pendingPost.text.slice(0, 140)}…`
              : pendingPost.text
          }
          confirmLabel="Verwijderen"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      ) : null}
    </div>
  );
}

export default App;
