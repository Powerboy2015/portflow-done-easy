import type { View } from "../types";

type SidebarProps = {
  view: View;
  onSelect: (view: View) => void;
};

// Basis zonder kleur: actief/inactief vullen bg + text elk exact één keer in,
// zodat er nooit conflicterende utilities (bg-white + bg-black) naast
// elkaar staan — Tailwind-volgorde in de stylesheet is dan irrelevant.
const NAV_BTN_BASE =
  "border-2 border-black px-2.5 py-2 text-left max-sm:flex-1";
const NAV_BTN = `${NAV_BTN_BASE} bg-white hover:bg-black hover:text-white`;
const NAV_BTN_ACTIVE = `${NAV_BTN_BASE} bg-black text-white`;

// Module-level: geen inline component-definities (rerender-no-inline-components).
export function Sidebar({ view, onSelect }: SidebarProps) {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r-2 border-black bg-white max-sm:w-auto max-sm:border-r-0 max-sm:border-b-2">
      <div className="flex flex-col gap-0.5 border-b-2 border-black p-3">
        <span className="text-xl font-bold">[PDE]</span>
        <span className="text-xs">portflow-done-easy</span>
        <span className="mt-1 inline-block self-start border border-black px-1 text-xs">
          TS.AI.0S1
        </span>
      </div>

      <nav className="flex flex-col gap-2 p-3 max-sm:flex-row" aria-label="Hoofdmenu">
        <button
          type="button"
          className={view !== "settings" ? NAV_BTN_ACTIVE : NAV_BTN}
          aria-current={view !== "settings" ? "page" : undefined}
          onClick={() => onSelect("new")}
        >
          <span aria-hidden="true">[+]</span> Nieuwe post
        </button>
        <button
          type="button"
          className={view === "settings" ? NAV_BTN_ACTIVE : NAV_BTN}
          aria-current={view === "settings" ? "page" : undefined}
          onClick={() => onSelect("settings")}
        >
          <span aria-hidden="true">[&#9881;]</span> Instellingen
        </button>
      </nav>

      <div className="mt-auto flex justify-between border-t-2 border-black px-3 py-2 text-xs max-sm:hidden">
        <span>[MVP]</span>
        <span>geen backend</span>
      </div>
    </aside>
  );
}
