import type { RefObject } from "react";
import { BTN, HEADING, PANEL } from "./ui";
import { CompetencyDropdown } from "./CompetencyDropdown";

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

// Module-level component; interaction logic runs via event handlers (rerender-move-effect-to-event).
// The competency dropdown is a memoized child so typing here does not
// re-render the option list (rerender-memo).
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
        <CompetencyDropdown
          selectedTags={selectedTags}
          onToggleTag={onToggleTag}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[0.8rem]">[{text.trim().length} tekens]</span>
        <button
          type="button"
          className={BTN}
          disabled={!canSubmit}
          onClick={onSubmit}
        >
          [Toevoegen]
        </button>
      </div>
    </section>
  );
}
