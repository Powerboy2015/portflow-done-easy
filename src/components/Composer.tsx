import type { RefObject } from "react";
import { COMPETENCIES } from "../competencies";
import { BTN, HEADING, PANEL } from "./ui";

type ComposerProps = {
  text: string;
  selectedTags: ReadonlySet<string>;
  /** Simpele afgeleide waarde — direct uitrekenen, geen useMemo (rerender-simple-expression-in-memo). */
  canSubmit: boolean;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  onTextChange: (value: string) => void;
  onToggleTag: (slug: string) => void;
  onSubmit: () => void;
};

const CHIP_BASE =
  "block w-full border-b border-black px-2 py-1.5 text-left text-[0.8rem] last:border-b-0";
const CHIP = `${CHIP_BASE} bg-white hover:bg-black hover:text-white`;
const CHIP_SELECTED = `${CHIP_BASE} bg-black text-white`;

// Module-level component; interactielogica loopt via event handlers (rerender-move-effect-to-event).
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
      <textarea
        id="pde-composer-input"
        ref={inputRef}
        className="w-full resize-y border-2 border-black bg-white p-2 outline-none focus:bg-[#f4f4f4]"
        placeholder="Waar ben je mee bezig? Beschrijf wat je vandaag hebt gedaan..."
        rows={5}
        value={text}
        onChange={(e) => onTextChange(e.currentTarget.value)}
      />
      <fieldset className="mt-2 border border-black p-2">
        <legend className="px-1 font-bold">
          Competenties [optioneel, {selectedTags.size} gekozen]
        </legend>
        <details
          className="border-2 border-black"
          onMouseEnter={(e) => {
            e.currentTarget.open = true;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.open = false;
          }}
        >
          <summary className="cursor-pointer px-2 py-1.5 hover:bg-black hover:text-white">
            {selectedTags.size > 0
              ? `[v] ${selectedTags.size} gekozen — klik om te wijzigen`
              : "[>] Kies competenties..."}
          </summary>
          <ul className="m-0 max-h-60 list-none overflow-y-auto border-t-2 border-black p-0">
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
      </fieldset>
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
