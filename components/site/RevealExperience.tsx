"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { ExperienceType } from "@/lib/types";
import type { Language } from "@/lib/occasion";
import { revealByType } from "@/lib/reveal";

const timings: Record<"envelope" | "gift", number> = {
  envelope: 1150,
  gift: 1050,
};

export default function RevealExperience({
  type,
  lang,
  interactive = false,
  onComplete,
  resetKey,
}: {
  type: ExperienceType;
  lang: Language;
  interactive?: boolean;
  onComplete?: () => void;
  resetKey?: number;
}) {
  const safeType: "envelope" | "gift" = type === "gift" ? "gift" : "envelope";
  const meta = revealByType(safeType);
  const [opened, setOpened] = useState(false);
  const ar = lang === "ar";

  useEffect(() => setOpened(false), [safeType, resetKey]);

  const open = () => {
    if (opened) return;
    setOpened(true);
    if (onComplete) window.setTimeout(onComplete, timings[safeType]);
  };

  return (
    <motion.div
      className={`reveal-scene-v7 reveal-scene-v7--${safeType} ${opened ? "is-open" : ""}`}
      key={safeType}
      initial={{ opacity: 0, y: 8, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="reveal-ambient-v7" aria-hidden="true" />

      <motion.div
        className={`reveal-object-v7 reveal-object-v7--${safeType}`}
        animate={
          opened
            ? safeType === "envelope"
              ? { y: 36, scale: 1.06, rotate: -1.5 }
              : { y: -8, scale: [1, 1.04, 0.98, 1.02], rotate: [0, -1.2, 1.2, 0] }
            : { y: 0, scale: 1, rotate: 0, opacity: 1 }
        }
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          className={`reveal-image-v7 reveal-image-v7--${safeType}`}
          src={meta.image}
          alt={meta.label[lang]}
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <AnimatePresence>
        {opened && (
          <>
            {safeType === "envelope" && (
              <motion.div
                className="reveal-letter-slip-v7"
                initial={{ y: 120, opacity: 0, scale: 0.94 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.18, duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
              >
                <span>ForYou</span>
                <i>♡</i>
              </motion.div>
            )}

            {safeType === "gift" && (
              <div className="reveal-confetti-v7" aria-hidden="true">
                {[0, 1, 2, 3, 4, 5, 6].map((item) => (
                  <motion.i
                    key={item}
                    initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
                    animate={{
                      x: [0, (item - 3) * 28],
                      y: [0, -75 - Math.abs(item - 3) * 8],
                      opacity: [0, 1, 0],
                      rotate: [0, item % 2 ? 110 : -110],
                    }}
                    transition={{ duration: 0.9, delay: item * 0.035 }}
                  />
                ))}
              </div>
            )}

            <motion.div
              className="reveal-opened-v7"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 }}
            >
              <Check size={18} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="reveal-meta-v7">
        <span>{meta.label[lang]}</span>
        <small>{meta.short[lang]}</small>
      </div>

      {interactive && !opened && (
        <button type="button" className="reveal-open-v7" onClick={open}>
          <span>{meta.action[lang]}</span>
          {ar ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        </button>
      )}
    </motion.div>
  );
}
