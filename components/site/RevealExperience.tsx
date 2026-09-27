"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ExperienceType } from "@/lib/types";
import type { Language } from "@/lib/occasion";
import { revealByType } from "@/lib/reveal";
import Envelope, { type EnvelopeHandle } from "@/components/objects/Envelope";
import GiftBox, { type GiftBoxHandle } from "@/components/objects/GiftBox";
import Balloon, { type BalloonHandle } from "@/components/objects/Balloon";
import WishLantern, { type WishLanternHandle } from "@/components/objects/WishLantern";
import SecretReveal, { type SecretRevealHandle } from "@/components/objects/SecretReveal";

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
  const meta = revealByType(type);
  const [opened, setOpened] = useState(false);
  const ar = lang === "ar";
  const envelopeRef = useRef<EnvelopeHandle>(null);
  const giftRef = useRef<GiftBoxHandle>(null);
  const balloonRef = useRef<BalloonHandle>(null);
  const lanternRef = useRef<WishLanternHandle>(null);
  const secretRef = useRef<SecretRevealHandle>(null);

  const reset = async () => {
    setOpened(false);
    if (type === "envelope") await envelopeRef.current?.close();
    if (type === "gift") await giftRef.current?.close();
    if (type === "balloon") await balloonRef.current?.reset();
    if (type === "wish") await lanternRef.current?.reset();
    if (type === "secret") await secretRef.current?.reset();
  };

  useEffect(() => {
    void reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, resetKey]);

  const open = async () => {
    if (opened) return;
    setOpened(true);

    if (type === "envelope") await envelopeRef.current?.open();
    if (type === "gift") await giftRef.current?.open();
    if (type === "balloon") await balloonRef.current?.pop();
    if (type === "wish") await lanternRef.current?.release();
    if (type === "secret") await secretRef.current?.reveal();

    if (onComplete) window.setTimeout(onComplete, 340);
  };

  return (
    <motion.div
      className={`reveal-object-card reveal-object-card--${type} ${opened ? "is-open" : ""}`}
      initial={{ opacity: 0, y: 10, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="reveal-object-deco reveal-object-deco--one" aria-hidden="true">♡</div>
      <div className="reveal-object-deco reveal-object-deco--two" aria-hidden="true">✦</div>

      <div className="reveal-object-stage">
        {type === "envelope" && <Envelope ref={envelopeRef} sealColor="#f45d73" className="reveal-object reveal-object--envelope" />}
        {type === "gift" && <GiftBox ref={giftRef} ribbonColor="#f45d73" className="reveal-object reveal-object--gift" />}
        {type === "balloon" && <Balloon ref={balloonRef} color="#b58cff" className="reveal-object reveal-object--balloon" />}
        {type === "wish" && <WishLantern ref={lanternRef} className="reveal-object reveal-object--wish" />}
        {type === "secret" && <SecretReveal ref={secretRef} className="reveal-object reveal-object--secret" />}
      </div>

      <div className="reveal-object-copy">
        <span>{meta.label[lang]}</span>
        <p>{meta.short[lang]}</p>
        {interactive && (
          <button onClick={open} disabled={opened}>
            <span>{opened ? (ar ? "جاري الفتح…" : "Opening…") : meta.action[lang]}</span>
            {!opened && (ar ? <ArrowLeft size={16} /> : <ArrowRight size={16} />)}
          </button>
        )}
      </div>
    </motion.div>
  );
}
