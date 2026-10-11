import { BTN, HEADING, PANEL } from "./ui";

type SettingsPanelProps = {
  onBack: () => void;
};

export function SettingsPanel({ onBack }: SettingsPanelProps) {
  return (
    <section className={PANEL} aria-labelledby="pde-settings-titel">
      <h1 id="pde-settings-titel" className={HEADING}>
        [Instellingen]
      </h1>
      <p>
        Hier komen later de instellingen (gekozen map, opslag). Nog geen
        functionaliteit in deze versie.
      </p>
      <button type="button" className={BTN} onClick={onBack}>
        [&lt;] Terug
      </button>
    </section>
  );
}
