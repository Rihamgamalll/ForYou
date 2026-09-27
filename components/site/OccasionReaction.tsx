"use client";

import { useState } from "react";
import type { OccasionMeta, Language } from "@/lib/occasion";

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
    <div
      className={`occasion-reaction ${compact ? "occasion-reaction--compact" : ""} ${meta.images.length > 1 ? "occasion-reaction--double" : ""}`}
      style={{ "--reaction-accent": meta.accent, "--reaction-soft": meta.soft } as React.CSSProperties}
      aria-label={meta.imageAlt[lang]}
    >
      <div className="occasion-reaction-fallback" aria-hidden="true">{meta.emoji}</div>
      {meta.images.map((src, index) => !failed[index] && (
        <img
          key={`${src}-${index}`}
          src={src}
          alt={index === 0 ? meta.imageAlt[lang] : ar ? "رد فعل لطيف إضافي" : "Another cute reaction"}
          loading={compact ? "lazy" : "eager"}
          onError={() => setFailed((current) => ({ ...current, [index]: true }))}
        />
      ))}
      {!compact && <span className="occasion-reaction-tape" aria-hidden="true" />}
    </div>
  );
}
