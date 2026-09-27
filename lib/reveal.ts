import type { ExperienceType } from "./types";
import type { Language } from "./occasion";

export interface RevealMeta {
  type: ExperienceType;
  label: Record<Language, string>;
  short: Record<Language, string>;
  action: Record<Language, string>;
  tone: "coral" | "rose" | "violet" | "amber" | "aqua";
}

export const REVEAL_META: RevealMeta[] = [
  {
    type: "envelope",
    label: { ar: "ظرف", en: "Envelope" },
    short: { ar: "الرسالة تخرج من ظرف", en: "A letter opens from an envelope" },
    action: { ar: "افتح الظرف", en: "Open envelope" },
    tone: "coral",
  },
  {
    type: "gift",
    label: { ar: "هدية", en: "Gift box" },
    short: { ar: "بوكس يتفتح قبل الرسالة", en: "A gift box opens first" },
    action: { ar: "افتح الهدية", en: "Open gift" },
    tone: "rose",
  },
  {
    type: "balloon",
    label: { ar: "بالونة", en: "Balloon" },
    short: { ar: "بالونة تنفجر وتظهر الرسالة", en: "Pop a balloon to reveal it" },
    action: { ar: "فرقع البالونة", en: "Pop balloon" },
    tone: "violet",
  },
  {
    type: "wish",
    label: { ar: "فانوس", en: "Lantern" },
    short: { ar: "فانوس يطلع قبل ظهور الرسالة", en: "Release a lantern before the message" },
    action: { ar: "اطلق الفانوس", en: "Release lantern" },
    tone: "amber",
  },
  {
    type: "secret",
    label: { ar: "رسالة سرية", en: "Secret note" },
    short: { ar: "رسالة مخبأة داخل زجاجة", en: "A note hidden inside a bottle" },
    action: { ar: "افتح الرسالة", en: "Reveal note" },
    tone: "aqua",
  },
];

export const revealByType = (type: ExperienceType) =>
  REVEAL_META.find((item) => item.type === type) ?? REVEAL_META[0];
