"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Lock, Sparkles } from "lucide-react";
import { getGift } from "@/lib/gift-service";
import { verifyPassword } from "@/lib/crypto";
import type { Gift } from "@/lib/types";
import { occasionByKey } from "@/lib/occasion";
import { revealByType } from "@/lib/reveal";
import { useSiteLanguage } from "@/hooks/use-site-language";
import SiteHeader from "@/components/site/SiteHeader";
import OccasionReaction from "@/components/site/OccasionReaction";
import RevealExperience from "@/components/site/RevealExperience";

type Stage = "loading" | "notfound" | "locked" | "reveal" | "message";

const copy = {
  ar: {
    title: "وصلك رسالة خاصة.",
    sub: "اكتب الباسورد عشان تفتحها.",
    hint: "تلميح",
    password: "الباسورد",
    unlock: "متابعة",
    helper: "الرسالة لا تظهر قبل إدخال الباسورد الصحيح.",
    wrong: "الباسورد غير صحيح.",
    messageFor: "رسالة لـ",
    from: "من",
    makeOne: "اعمل رسالة خاصة",
    notFoundTag: "الرابط غير متاح",
    notFoundTitle: "المفاجأة مش موجودة.",
    notFoundSub: "تأكد إن اللينك كامل وصحيح.",
    home: "الرئيسية",
  },
  en: {
    title: "You received a private message.",
    sub: "Enter the password to open it.",
    hint: "Hint",
    password: "Password",
    unlock: "Continue",
    helper: "The message stays hidden until the correct password is entered.",
    wrong: "Incorrect password.",
    messageFor: "A message for",
    from: "From",
    makeOne: "Create your own message",
    notFoundTag: "Link unavailable",
    notFoundTitle: "This surprise isn't available.",
    notFoundSub: "Check that the link is complete and correct.",
    home: "Home",
  },
};

export default function GiftPage() {
  const params = useParams();
  const giftId = params.id as string;
  const { lang, toggleLanguage, isArabic } = useSiteLanguage("ar");
  const t = copy[lang];
  const [stage, setStage] = useState<Stage>("loading");
  const [gift, setGift] = useState<Gift | null>(null);
  const [password, setPassword] = useState("");
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getGift(giftId);
      if (!data) return setStage("notfound");
      setGift(data);
      setStage("locked");
    })();
  }, [giftId]);

  const unlock = useCallback(async () => {
    if (!gift) return;
    const valid = await verifyPassword(password, gift.passwordHash);
    if (!valid) {
      setWrong(true);
      window.setTimeout(() => setWrong(false), 700);
      return;
    }
    setWrong(false);
    setStage("reveal");
  }, [gift, password]);

  if (stage === "loading") {
    return <div className="gift-page gift-loading" dir={isArabic ? "rtl" : "ltr"}><div className="gift-loader">💌</div></div>;
  }

  if (stage === "notfound") {
    return (
      <div className="gift-page gift-notfound" dir={isArabic ? "rtl" : "ltr"}>
        <SiteHeader lang={lang} onToggleLanguage={toggleLanguage} compact />
        <div className="gift-notfound-inner">
          <span>{t.notFoundTag}</span><h1>{t.notFoundTitle}</h1><p>{t.notFoundSub}</p>
          <Link href={`/?lang=${lang}`} className="fy-button fy-button--ink">{t.home} {isArabic ? <ArrowLeft size={16}/> : <ArrowRight size={16}/>}</Link>
        </div>
      </div>
    );
  }

  const reveal = gift ? revealByType(gift.experienceType) : null;

  return (
    <div className="gift-page" dir={isArabic ? "rtl" : "ltr"}>
      <SiteHeader lang={lang} onToggleLanguage={toggleLanguage} compact />

      <AnimatePresence mode="wait">
        {stage === "locked" && gift && reveal && (
          <motion.section key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} className="gift-lock-stage gift-lock-stage--clean">
            <div className="gift-lock-card gift-lock-card--clean">
              <div className="gift-lock-visual-v4">
                <div className="gift-lock-object-v4"><RevealExperience type={gift.experienceType} lang={lang} /></div>
                <span className="gift-lock-type-v4"><Lock size={15}/>{reveal.label[lang]}</span>
              </div>
              <h1>{t.title}</h1>
              <p className="gift-lock-sub">{t.sub}</p>
              {gift.passwordHint && <p className="gift-hint"><b>{t.hint}:</b> {gift.passwordHint}</p>}
              <motion.div className="gift-password-wrap" animate={wrong ? { x:[0,-7,7,-5,5,0] } : { x:0 }}>
                <input autoFocus type="password" value={password} onChange={(e)=>setPassword(e.target.value)} onKeyDown={(e)=>e.key === "Enter" && unlock()} placeholder={t.password} />
                <button onClick={unlock}>{t.unlock} {isArabic ? <ArrowLeft size={16}/> : <ArrowRight size={16}/>}</button>
                <small className={wrong ? "is-error" : ""}>{wrong ? t.wrong : t.helper}</small>
              </motion.div>
            </div>
          </motion.section>
        )}

        {stage === "reveal" && gift && (
          <motion.section key="reveal" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="gift-real-reveal-stage">
            <div className="gift-real-reveal-wrap">
              <RevealExperience type={gift.experienceType} lang={lang} interactive onComplete={() => setStage("message")} />
            </div>
          </motion.section>
        )}

        {stage === "message" && gift && <MessageStage key="message" gift={gift} lang={lang} isArabic={isArabic} />}
      </AnimatePresence>
    </div>
  );
}

function MessageStage({ gift, lang, isArabic }: { gift: Gift; lang: "ar" | "en"; isArabic: boolean }) {
  const t = copy[lang];
  const meta = occasionByKey(gift.occasion);

  return (
    <motion.section initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:.62 }} className="gift-message-stage gift-message-stage--clean" style={{"--gift-accent":meta.accent,"--gift-soft":meta.soft} as React.CSSProperties}>
      <div className="gift-message-wrap gift-message-wrap--clean">
        <motion.div className="gift-reaction-column" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.05,duration:.55}}>
          <OccasionReaction meta={meta} lang={lang} />
          <div className="gift-reaction-caption"><span>{meta.emoji}</span><b>{meta.finale[lang]}</b></div>
        </motion.div>

        <motion.div className="gift-letter-column" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.12,duration:.6,ease:[.16,1,.3,1]}}>
          <div className="gift-letter-kicker">{meta.label[lang]}</div>
          <h1>{t.messageFor} {gift.recipientName}</h1>
          <div className="gift-letter-card gift-letter-card--clean">
            <p>{gift.message}</p>
            {gift.creatorName && <footer>{t.from} {gift.creatorName}</footer>}
          </div>
          <Link href={`/create?lang=${lang}`} className="gift-create-own">{t.makeOne} <Sparkles size={14}/></Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
