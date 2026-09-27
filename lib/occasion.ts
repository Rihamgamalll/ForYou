import type { Occasion } from "./types";

export type Language = "ar" | "en";

export interface OccasionMeta {
  key: Occasion;
  emoji: string;
  label: Record<Language, string>;
  note: Record<Language, string>;
  accent: string;
  soft: string;
  images: string[];
  imageAlt: Record<Language, string>;
  finale: Record<Language, string>;
}

export const OCCASION_META: OccasionMeta[] = [
  {
    key: "Birthday",
    emoji: "🎂",
    label: { ar: "عيد ميلاد", en: "Birthday" },
    note: { ar: "لتهنئة عيد الميلاد", en: "For a birthday message" },
    accent: "#e96b63",
    soft: "#fff3f0",
    images: ["/reactions/birthday-balloon.png"],
    imageAlt: { ar: "رسمة عيد ميلاد ببالونة وتورتة", en: "A playful birthday drawing with a balloon and cake" },
    finale: { ar: "عيد ميلاد سعيد", en: "Happy birthday" },
  },
  {
    key: "Graduation",
    emoji: "🎓",
    label: { ar: "تخرج", en: "Graduation" },
    note: { ar: "لتهنئة التخرج", en: "For graduation wishes" },
    accent: "#6f6ad8",
    soft: "#f3f1ff",
    images: ["/reactions/graduation-zaghroota.png"],
    imageAlt: { ar: "رد فعل احتفالي للتخرج", en: "A celebratory graduation reaction" },
    finale: { ar: "مبروك التخرج", en: "Graduation" },
  },
  {
    key: "Congratulations",
    emoji: "🎉",
    label: { ar: "مبروك", en: "Congratulations" },
    note: { ar: "لأي خبر أو إنجاز جميل", en: "For good news and achievements" },
    accent: "#d95f92",
    soft: "#fff2f7",
    images: ["/reactions/congrats-heart.png"],
    imageAlt: { ar: "قطة مع قلب مكتوب عليه أنا فخور بك", en: "A cat with an I'm proud of you heart" },
    finale: { ar: "مبروك", en: "Congratulations" },
  },
  {
    key: "Thank You",
    emoji: "🫶",
    label: { ar: "شكرًا", en: "Thank You" },
    note: { ar: "لرسالة شكر", en: "For a thank-you message" },
    accent: "#31866f",
    soft: "#eef9f5",
    images: ["/reactions/thank-you-kid.png", "/reactions/thank-you-cat.png"],
    imageAlt: { ar: "ردود فعل لطيفة للشكر", en: "Cute thank-you reactions" },
    finale: { ar: "شكرًا", en: "Thank you" },
  },
  {
    key: "Miss You",
    emoji: "🥹",
    label: { ar: "وحشتني", en: "Miss You" },
    note: { ar: "لرسالة اشتياق", en: "For an I-miss-you message" },
    accent: "#c98745",
    soft: "#fff7ec",
    images: ["/reactions/miss-you.png"],
    imageAlt: { ar: "رد فعل لشخص مشتاق", en: "A missing-you reaction" },
    finale: { ar: "وحشتني", en: "Miss you" },
  },
  {
    key: "Love",
    emoji: "💗",
    label: { ar: "حب", en: "Love" },
    note: { ar: "لرسالة حب", en: "For a love message" },
    accent: "#db6672",
    soft: "#fff2f3",
    images: ["/reactions/love-hug.png"],
    imageAlt: { ar: "حضن لطيف للحب", en: "An affectionate hug reaction" },
    finale: { ar: "حب", en: "Love" },
  },
];

export const occasionByKey = (key: Occasion) =>
  OCCASION_META.find((item) => item.key === key) ?? OCCASION_META[0];
