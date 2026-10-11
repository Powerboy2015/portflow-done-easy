import { getCurrentWindow } from "@tauri-apps/api/window";

// Window APIs only exist inside Tauri; in the browser (vite dev)
// we render the bar without buttons so there are never dead controls.
const IN_TAURI =
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

const TITLE_BTN =
  "border-2 border-white bg-black px-2 py-0.5 text-sm leading-none text-white hover:bg-white hover:text-black";

// All window actions run via event handlers, no effects/state needed.
async function handleMinimize() {
  await getCurrentWindow().minimize();
}

async function handleToggleMaximize() {
  await getCurrentWindow().toggleMaximize();
}

async function handleClose() {
  await getCurrentWindow().close();
}

// Programmatic dragging on top of data-tauri-drag-region (on
// Windows the attribute alone is not always enough). Deliberately no
// IN_TAURI gate: outside Tauri the call fails and the error is swallowed,
// so a wrong runtime detection can never break dragging.
// The call sits synchronously in the mousedown handler (no await before it),
// so Tauri accepts it as a user gesture. Clicks from buttons
// are skipped so min/max/close stay clickable.
function handleDragMouseDown(e: {
  button: number;
  target: EventTarget | null;
}) {
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
}

// Module-level component; brutalist titlebar replacing the
// native Windows titlebar (window runs frameless, see tauri.conf.json).
export function Titlebar() {
  return (
    <header
      data-tauri-drag-region
      aria-label="Vensterbalk"
      className="sticky top-0 z-50 flex shrink-0 touch-none items-center justify-between gap-2 border-b-2 border-black bg-black px-2 py-1 font-mono text-sm leading-[1.4] text-white select-none"
      onMouseDown={(e) => handleDragMouseDown(e)}
      onDoubleClick={() => {
        if (IN_TAURI) void handleToggleMaximize();
      }}
    >
      <div data-tauri-drag-region className="flex min-w-0 items-center gap-2">
        <span
          data-tauri-drag-region
          className="shrink-0 border border-white px-1 font-bold"
        >
          [PDE]
        </span>
        <span data-tauri-drag-region className="truncate">
          portflow-done-easy
        </span>
        <span
          data-tauri-drag-region
          className="hidden shrink-0 text-xs min-[420px]:inline"
        >
          [TS.AI.0S1]
        </span>
      </div>

      {IN_TAURI ? (
        <div
          className="flex shrink-0 items-center gap-1.5"
          role="group"
          aria-label="Vensterknoppen"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={TITLE_BTN}
            aria-label="Minimaliseren"
            title="Minimaliseren"
            onClick={() => void handleMinimize()}
          >
            <span aria-hidden="true">[_]</span>
          </button>
          <button
            type="button"
            className={TITLE_BTN}
            aria-label="Maximaliseren of herstellen"
            title="Maximaliseren of herstellen"
            onClick={() => void handleToggleMaximize()}
          >
            <span aria-hidden="true">[□]</span>
          </button>
          <button
            type="button"
            className={TITLE_BTN}
            aria-label="Sluiten"
            title="Sluiten"
            onClick={() => void handleClose()}
          >
            <span aria-hidden="true">[x]</span>
          </button>
        </div>
      ) : null}
    </header>
  );
}
