import { memo } from "react";
import { COMPETENCIES } from "../competencies";

type CompetencyDropdownProps = {
  selectedTags: ReadonlySet<string>;
  onToggleTag: (slug: string) => void;
};

const CHIP_BASE =
  "block w-full border-b border-black px-1.5 py-1 text-left text-[0.7rem] leading-tight last:border-b-0";
const CHIP = `${CHIP_BASE} bg-white hover:bg-black hover:text-white`;
const CHIP_SELECTED = `${CHIP_BASE} bg-black text-white`;

// Memoized so keystrokes in the composer textarea do not re-render the
// option list: selectedTags keeps its identity until a tag toggles and
// onToggleTag is a stable callback (rerender-memo).
export const CompetencyDropdown = memo(function CompetencyDropdown({
  selectedTags,
  onToggleTag,
}: CompetencyDropdownProps) {
  return (
    <div
      role="group"
      aria-label={`Competenties, optioneel, ${selectedTags.size} gekozen`}
      className="border-t-2 border-black"
    >
      <details className="relative">
        <summary className="cursor-pointer px-2 py-1 text-[0.8rem] hover:bg-black hover:text-white">
          {selectedTags.size > 0
            ? `[v] Competenties [${selectedTags.size} gekozen] — wijzig`
            : "[>] Competenties [optioneel] — kies..."}
        </summary>
        <ul className="absolute inset-x-0 top-full z-10 m-0 max-h-40 list-none overflow-y-auto border-2 border-black bg-white p-0">
          {COMPETENCIES.map((c) => {
            const selected = selectedTags.has(c.slug);
            return (
              <li key={c.slug} className="m-0 p-0">
                <button
                  type="button"
                  className={selected ? CHIP_SELECTED : CHIP}
                  aria-pressed={selected}
                  title={c.beschrijving}
                  onClick={() => onToggleTag(c.slug)}
                >
                  [{selected ? "x" : " "}] {c.label}
                </button>
              </li>
            );
          })}
        </ul>
      </details>
    </div>
  );
});
