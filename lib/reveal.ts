import type { ExperienceType } from "./types";
import type { Language } from "./occasion";

export interface RevealMeta {
  type: ExperienceType;
  label: Record<Language, string>;
  short: Record<Language, string>;
  action: Record<Language, string>;
  tone: "coral" | "rose" | "violet" | "amber" | "aqua";
  image: string;
  sourceUrl: string;
}

export const REVEAL_META: RevealMeta[] = [
  {
    type: "envelope",
    label: { ar: "ظرف مختوم", en: "Sealed envelope" },
    short: { ar: "يفتح كرسالة مختومة", en: "Opens like a sealed note" },
    action: { ar: "اكسر الختم", en: "Break the seal" },
    tone: "coral",
    image: "/reveals/envelope-red.png",
    sourceUrl: "user-provided",
  },
  {
    type: "gift",
    label: { ar: "هدية", en: "Gift" },
    short: { ar: "هدية قبل الرسالة", en: "A gift before the note" },
    action: { ar: "افتح الهدية", en: "Open the gift" },
    tone: "rose",
    image: "/reveals/gift-figure.png",
    sourceUrl: "user-provided",
  },
];

export const revealByType = (type: ExperienceType) =>
  REVEAL_META.find((item) => item.type === type) ?? REVEAL_META[0];
