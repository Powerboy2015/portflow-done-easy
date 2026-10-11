import { useWindowControls } from "../hooks/useWindowControls";

const TITLE_BTN =
  "border-2 border-white bg-black px-2 py-0.5 text-sm leading-none text-white hover:bg-white hover:text-black";

// Module-level component; brutalist titlebar replacing the
// native Windows titlebar (window runs frameless, see tauri.conf.json).
// All window actions come from useWindowControls, so this file is pure view.
export function Titlebar() {
  const { isTauri, minimize, toggleMaximize, close, startDrag } =
    useWindowControls();

  return (
    <header
      data-tauri-drag-region
      aria-label="Vensterbalk"
      className="sticky top-0 z-50 flex shrink-0 touch-none items-center justify-between gap-2 border-b-2 border-black bg-black px-2 py-1 font-mono text-sm leading-[1.4] text-white select-none"
      onMouseDown={(e) => startDrag(e)}
      onDoubleClick={() => {
        if (isTauri) toggleMaximize();
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

      {isTauri ? (
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
            onClick={minimize}
          >
            <span aria-hidden="true">[_]</span>
          </button>
          <button
            type="button"
            className={TITLE_BTN}
            aria-label="Maximaliseren of herstellen"
            title="Maximaliseren of herstellen"
            onClick={toggleMaximize}
          >
            <span aria-hidden="true">[□]</span>
          </button>
          <button
            type="button"
            className={TITLE_BTN}
            aria-label="Sluiten"
            title="Sluiten"
            onClick={close}
          >
            <span aria-hidden="true">[x]</span>
          </button>
        </div>
      ) : null}
    </header>
  );
}
