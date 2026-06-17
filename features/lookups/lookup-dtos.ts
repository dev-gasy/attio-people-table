export type LookupDto = {
  id: number;
  lookupName: string;
  code: string;
  orderNo: number;
  displayValueEn: string;
  displayValueFr: string;
  effectiveDate: string;
};

const LOOKUPS_PER_NAME = 100;

type LookupDefinition = {
  lookupName: string;
  codePrefix: string;
  effectiveDate: string;
  values: {
    displayValueEn: string;
    displayValueFr: string;
  }[];
};

const lookupDefinitions: LookupDefinition[] = [
  {
    lookupName: "Customer status",
    codePrefix: "CUSTOMER_STATUS",
    effectiveDate: "2026-01-01",
    values: [
      { displayValueEn: "Active", displayValueFr: "Actif" },
      {
        displayValueEn: "Pending review",
        displayValueFr: "En attente de revision",
      },
      { displayValueEn: "Inactive", displayValueFr: "Inactif" },
    ],
  },
  {
    lookupName: "Region",
    codePrefix: "REGION",
    effectiveDate: "2026-02-15",
    values: [
      { displayValueEn: "North America", displayValueFr: "Amerique du Nord" },
      { displayValueEn: "Europe", displayValueFr: "Europe" },
      { displayValueEn: "Asia Pacific", displayValueFr: "Asie-Pacifique" },
    ],
  },
  {
    lookupName: "Priority",
    codePrefix: "PRIORITY",
    effectiveDate: "2026-03-01",
    values: [
      { displayValueEn: "High", displayValueFr: "Elevee" },
      { displayValueEn: "Medium", displayValueFr: "Moyenne" },
      { displayValueEn: "Low", displayValueFr: "Faible" },
    ],
  },
  {
    lookupName: "Language",
    codePrefix: "LANGUAGE",
    effectiveDate: "2026-04-01",
    values: [
      { displayValueEn: "English", displayValueFr: "Anglais" },
      { displayValueEn: "French", displayValueFr: "Francais" },
    ],
  },
  {
    lookupName: "Contact method",
    codePrefix: "CONTACT_METHOD",
    effectiveDate: "2026-05-01",
    values: [
      { displayValueEn: "Email", displayValueFr: "Courriel" },
      { displayValueEn: "Phone", displayValueFr: "Telephone" },
      { displayValueEn: "Text message", displayValueFr: "Message texte" },
    ],
  },
  {
    lookupName: "Billing cycle",
    codePrefix: "BILLING_CYCLE",
    effectiveDate: "2026-06-01",
    values: [
      { displayValueEn: "Monthly", displayValueFr: "Mensuel" },
      { displayValueEn: "Annual", displayValueFr: "Annuel" },
    ],
  },
  {
    lookupName: "Account tier",
    codePrefix: "ACCOUNT_TIER",
    effectiveDate: "2026-06-15",
    values: [
      { displayValueEn: "Standard", displayValueFr: "Standard" },
      { displayValueEn: "Enterprise", displayValueFr: "Entreprise" },
    ],
  },
  {
    lookupName: "Age",
    codePrefix: "AGE",
    effectiveDate: "2026-01-01",
    values: [
      { displayValueEn: "18 to 24", displayValueFr: "18 a 24" },
      { displayValueEn: "25 to 34", displayValueFr: "25 a 34" },
      { displayValueEn: "35 to 44", displayValueFr: "35 a 44" },
      { displayValueEn: "45 to 54", displayValueFr: "45 a 54" },
      { displayValueEn: "55 plus", displayValueFr: "55 et plus" },
    ],
  },
];

export const lookupSeed: LookupDto[] = lookupDefinitions.flatMap(
  (definition, definitionIndex) =>
    Array.from({ length: LOOKUPS_PER_NAME }, (_, index) => {
      const orderNo = index + 1;
      const value = definition.values[index % definition.values.length];
      const cycle = Math.floor(index / definition.values.length);
      const suffix =
        cycle === 0 ? "" : ` ${String(cycle + 1).padStart(2, "0")}`;

      return {
        id: definitionIndex * LOOKUPS_PER_NAME + orderNo,
        lookupName: definition.lookupName,
        code: `${definition.codePrefix}_${String(orderNo).padStart(3, "0")}`,
        orderNo,
        displayValueEn: `${value.displayValueEn}${suffix}`,
        displayValueFr: `${value.displayValueFr}${suffix}`,
        effectiveDate: definition.effectiveDate,
      };
    }),
);
