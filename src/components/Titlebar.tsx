import { getCurrentWindow } from "@tauri-apps/api/window";

// Alleen binnen Tauri bestaan venster-API's; in de browser (vite dev)
// renderen we de balk zonder knoppen zodat er nooit dode controls staan.
const IN_TAURI =
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

const TITLE_BTN =
  "border-2 border-white bg-black px-2 py-0.5 text-sm leading-none text-white hover:bg-white hover:text-black";

// Alle vensteracties lopen via event handlers, geen effects/state nodig.
async function handleMinimize() {
  await getCurrentWindow().minimize();
}

async function handleToggleMaximize() {
  await getCurrentWindow().toggleMaximize();
}

async function handleClose() {
  await getCurrentWindow().close();
}

// Programmatisch slepen als aanvulling op data-tauri-drag-region (op
// Windows volstaat het attribuut alleen niet altijd). Bewust géén
// IN_TAURI-gate: buiten Tauri faalt de call en wordt de fout geslikt,
// zodat een verkeerde runtime-detectie het slepen nooit kan breken.
// De call staat synchroon in de mousedown-handler (geen await ervoor),
// zodat Tauri hem als gebruikersgebaar accepteert. Kliks vanaf knoppen
// worden overgeslagen zodat min/max/sluiten klikbaar blijven.
function handleDragMouseDown(e: {
  button: number;
  target: EventTarget | null;
}) {
  if (e.button !== 0) return;
  const el = e.target as Element | null;
  if (typeof el?.closest === "function" && el.closest("button")) return;
  try {
    getCurrentWindow().startDragging().catch(() => {
      // Geen Tauri-runtime (browser-dev): niets te slepen.
    });
  } catch {
    // getCurrentWindow() zelf gooit buiten Tauri: ook negeren.
  }
}

// Module-level component; brutalist vensterbalk ter vervanging van de
// native Windows-titelbalk (venster draait frameless, zie tauri.conf.json).
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
