// LEF competenties — source of truth: https://lef.hu.nl/ (zie AGENT.md).
// Hardcoded, geen runtime fetch. Niveau 1-4 wordt NIET gerenderd in MVP (ADR-006).

export type Competency = {
  slug: string;
  label: string;
  beschrijving: string;
  niveaus: [string, string, string, string];
};

export const COMPETENCIES: Competency[] = [
  {
    slug: "overzicht-creeren",
    label: "Overzicht creëren",
    beschrijving:
      "Methodisch relevante info verzamelen, onderzoeksvragen, vereisten.",
    niveaus: [
      "Niveau 1: verzamelt onder begeleiding relevante informatie.",
      "Niveau 2: formuleert zelfstandig onderzoeksvragen en vereisten.",
      "Niveau 3: brengt zelfstandig samenhang aan in complexe informatie.",
      "Niveau 4: creëert overzicht dat richting geeft aan anderen.",
    ],
  },
  {
    slug: "kritisch-oordelen",
    label: "Kritisch oordelen",
    beschrijving: "Keuzes onderbouwen, valide conclusies, evalueren.",
    niveaus: [
      "Niveau 1: onderbouwt keuzes met hulp van anderen.",
      "Niveau 2: trekt zelfstandig valide conclusies uit beschikbare info.",
      "Niveau 3: evalueert kritisch eigen en andermans werk.",
      "Niveau 4: bewaakt kwaliteit van oordeelsvorming in een team.",
    ],
  },
  {
    slug: "juiste-kennis-ontwikkelen",
    label: "Juiste kennis ontwikkelen",
    beschrijving:
      "Leerdoelen/leerplan, betrouwbare bronnen, toepassen.",
    niveaus: [
      "Niveau 1: stelt met hulp leerdoelen op en gebruikt aangereikte bronnen.",
      "Niveau 2: kiest zelfstandig betrouwbare bronnen en past kennis toe.",
      "Niveau 3: bouwt gestructureerd eigen expertise op.",
      "Niveau 4: ontwikkelt kennis die ook anderen verder helpt.",
    ],
  },
  {
    slug: "kwalitatief-product-maken",
    label: "Kwalitatief product maken",
    beschrijving:
      "Vereisten toepassen, ontwerpkeuzes onderbouwen, overdraagbaar.",
    niveaus: [
      "Niveau 1: maakt onder begeleiding een product dat aan vereisten voldoet.",
      "Niveau 2: onderbouwt zelfstandig ontwerpkeuzes.",
      "Niveau 3: levert overdraagbaar werk van constante kwaliteit.",
      "Niveau 4: zet de kwaliteitsstandaard voor het team.",
    ],
  },
  {
    slug: "plannen",
    label: "Plannen",
    beschrijving:
      "Eigen/gezamenlijk werk plannen, bijsturen, capaciteit.",
    niveaus: [
      "Niveau 1: plant eigen werk met hulp en meldt afwijkingen.",
      "Niveau 2: plant zelfstandig eigen werk en stuurt bij.",
      "Niveau 3: plant gezamenlijk werk realistisch in.",
      "Niveau 4: bewaakt planning en capaciteit van het geheel.",
    ],
  },
  {
    slug: "boodschap-delen",
    label: "Boodschap delen",
    beschrijving:
      "Doelgericht overbrengen, afstemmen op publiek, feedback verwerken.",
    niveaus: [
      "Niveau 1: brengt een boodschap begrijpelijk over.",
      "Niveau 2: stemt de boodschap af op het publiek.",
      "Niveau 3: verwerkt feedback doelgericht in de boodschap.",
      "Niveau 4: communiceert strategisch in complexe situaties.",
    ],
  },
  {
    slug: "samenwerken",
    label: "Samenwerken",
    beschrijving:
      "Rol kennen, afspraken nakomen, feedback geven/ontvangen.",
    niveaus: [
      "Niveau 1: kent eigen rol en komt afspraken na.",
      "Niveau 2: geeft en ontvangt feedback constructief.",
      "Niveau 3: versterkt actief de samenwerking.",
      "Niveau 4: draagt samenwerking in complexe teams.",
    ],
  },
  {
    slug: "flexibel-opstellen",
    label: "Flexibel opstellen",
    beschrijving: "Aanpassen, doorzetten, meebewegen bij verandering.",
    niveaus: [
      "Niveau 1: past zich aan bij kleine veranderingen.",
      "Niveau 2: zet door en beweegt mee bij verandering.",
      "Niveau 3: benut veranderingen als kans.",
      "Niveau 4: helpt anderen omgaan met verandering.",
    ],
  },
  {
    slug: "pro-actief-handelen",
    label: "Pro-actief handelen",
    beschrijving:
      "Zelf regie, initiatief zonder aanwijzingen, effect laten zien.",
    niveaus: [
      "Niveau 1: neemt initiatief bij duidelijke taken.",
      "Niveau 2: handelt zelfstandig zonder aanwijzingen.",
      "Niveau 3: pakt regie en laat zichtbaar effect zien.",
      "Niveau 4: creëert pro-actief kansen voor het team.",
    ],
  },
  {
    slug: "reflecteren",
    label: "Reflecteren",
    beschrijving:
      "Terugkijken op handelen, feedback + actiepunten + ontwikkeldoelen.",
    niveaus: [
      "Niveau 1: kijkt terug op eigen handelen met hulp.",
      "Niveau 2: formuleert zelfstandig actiepunten uit feedback.",
      "Niveau 3: stelt ontwikkeldoelen en volgt ze op.",
      "Niveau 4: reflecteert structureel en inspireert anderen.",
    ],
  },
];

// O(1) lookup per slug i.p.v. herhaalde .find() (js-index-maps).
export const COMPETENCY_BY_SLUG: ReadonlyMap<string, Competency> = new Map(
  COMPETENCIES.map((c) => [c.slug, c]),
);

export function competencyLabel(slug: string): string {
  return COMPETENCY_BY_SLUG.get(slug)?.label ?? slug;
}
