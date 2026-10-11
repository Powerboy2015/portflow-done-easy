import { useCallback } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

// Window APIs only exist inside Tauri; in the browser (vite dev)
// the bar renders without buttons so there are never dead controls.
const IS_TAURI =
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

type DragEvent = {
  button: number;
  target: EventTarget | null;
};

// All window actions run via event handlers, no effects/state needed
// (rerender-move-effect-to-event). Handlers are stable across renders.
export function useWindowControls() {
  const minimize = useCallback(() => {
    void getCurrentWindow().minimize();
  }, []);

  const toggleMaximize = useCallback(() => {
    void getCurrentWindow().toggleMaximize();
  }, []);

  const close = useCallback(() => {
    void getCurrentWindow().close();
  }, []);

  // Programmatic dragging on top of data-tauri-drag-region (on
  // Windows the attribute alone is not always enough). Deliberately no
  // IS_TAURI gate: outside Tauri the call fails and the error is swallowed,
  // so a wrong runtime detection can never break dragging.
  // The call sits synchronously in the mousedown handler (no await before it),
  // so Tauri accepts it as a user gesture. Clicks from buttons
  // are skipped so min/max/close stay clickable.
  const startDrag = useCallback((e: DragEvent) => {
    if (e.button !== 0) return;
    const el = e.target as Element | null;
    if (typeof el?.closest === "function" && el.closest("button")) return;
    try {
      getCurrentWindow().startDragging().catch(() => {
        // No Tauri runtime (browser-dev): nothing to drag.
      });
    } catch {
      // getCurrentWindow() itself throws outside Tauri: ignore as well.
    }
  }, []);

  return { isTauri: IS_TAURI, minimize, toggleMaximize, close, startDrag };
}
