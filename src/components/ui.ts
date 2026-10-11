// Gedeelde Tailwind-klassen voor de PDE-huisstijl.
// Direct importeren per component (bundle-barrel-imports).

/** Brutalist paneel: vierkant, 2px border, wit op zwart. */
export const PANEL = "mb-4 border-2 border-black bg-white p-3";

/** Paneeltitel: 1rem, vet, uppercase. */
export const HEADING = "mb-2 text-base font-bold uppercase";

/** Primaire knop: zwart blok, inverteert op hover. */
export const BTN =
  "border-2 border-black bg-black px-3.5 py-1.5 font-bold text-white hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-35";
