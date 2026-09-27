"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { OccasionMeta, Language } from "@/lib/occasion";

const safeClass = (value: string) => value.toLowerCase().replace(/\s+/g, "-");

export default function OccasionReaction({
  meta,
  lang,
  compact = false,
}: {
  meta: OccasionMeta;
  lang: Language;
  compact?: boolean;
}) {
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const ar = lang === "ar";

  return (
    <motion.div
      className={`occasion-reaction-v7 occasion-reaction-v7--${safeClass(meta.key)} ${compact ? "occasion-reaction-v7--compact" : ""} ${meta.images.length > 1 ? "occasion-reaction-v7--double" : ""}`}
      style={{ "--reaction-accent": meta.accent, "--reaction-soft": meta.soft } as React.CSSProperties}
      aria-label={meta.imageAlt[lang]}
      initial={compact ? false : { opacity: 0, y: 24, rotate: -2, scale: 0.96 }}
      animate={compact ? undefined : { opacity: 1, y: 0, rotate: 0, scale: 1 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="occasion-reaction-v7__glow" aria-hidden="true" />
      <div className="occasion-reaction-v7__fallback" aria-hidden="true">{meta.emoji}</div>
      {meta.images.map((src, index) => !failed[index] && (
        <motion.img
          key={`${src}-${index}`}
          src={src}
          alt={index === 0 ? meta.imageAlt[lang] : ar ? "رد فعل إضافي" : "Additional reaction"}
          loading={compact ? "lazy" : "eager"}
          onError={() => setFailed((current) => ({ ...current, [index]: true }))}
          initial={compact ? false : { opacity: 0, y: 18, rotate: index % 2 ? 5 : -4, scale: 0.95 }}
          animate={compact ? undefined : { opacity: 1, y: 0, rotate: index % 2 ? 3 : -2, scale: 1 }}
          transition={{ delay: 0.12 + index * 0.13, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      {!compact && <span className="occasion-reaction-v7__stamp" aria-hidden="true">{meta.emoji}</span>}
    </motion.div>
  );
}
