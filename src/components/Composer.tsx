import type { RefObject } from "react";
import { COMPETENCIES } from "../competencies";
import { BTN, HEADING, PANEL } from "./ui";

type ComposerProps = {
  text: string;
  selectedTags: ReadonlySet<string>;
  /** Simple derived value — compute directly, no useMemo (rerender-simple-expression-in-memo). */
  canSubmit: boolean;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  onTextChange: (value: string) => void;
  onToggleTag: (slug: string) => void;
  onSubmit: () => void;
};

const CHIP_BASE =
  "block w-full border-b border-black px-1.5 py-1 text-left text-[0.7rem] leading-tight last:border-b-0";
const CHIP = `${CHIP_BASE} bg-white hover:bg-black hover:text-white`;
const CHIP_SELECTED = `${CHIP_BASE} bg-black text-white`;

// Module-level component; interaction logic runs via event handlers (rerender-move-effect-to-event).
export function Composer({
  text,
  selectedTags,
  canSubmit,
  inputRef,
  onTextChange,
  onToggleTag,
  onSubmit,
}: ComposerProps) {
  return (
    <section className={PANEL} aria-labelledby="pde-composer-titel">
      <h1 id="pde-composer-titel" className={HEADING}>
        [Wat heb je vandaag gedaan?]
      </h1>
      <div className="border-2 border-black bg-white">
        <textarea
          id="pde-composer-input"
          ref={inputRef}
          className="block w-full resize-y border-0 bg-white p-2 outline-none focus:bg-[#f4f4f4]"
          placeholder="Waar ben je mee bezig? Beschrijf wat je vandaag hebt gedaan..."
          rows={8}
          value={text}
          onChange={(e) => onTextChange(e.currentTarget.value)}
        />
        <div
          role="group"
          aria-label={`Competenties, optioneel, ${selectedTags.size} gekozen`}
          className="border-t-2 border-black"
        >
          <details
            className="relative"
            onMouseEnter={(e) => {
              e.currentTarget.open = true;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.open = false;
            }}
          >
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
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[0.8rem]">[{text.trim().length} tekens]</span>
        <button
          type="button"
          className={BTN}
          disabled={!canSubmit}
          onClick={onSubmit}
        >
          [Plaatsen]
        </button>
      </div>
    </section>
  );
}
