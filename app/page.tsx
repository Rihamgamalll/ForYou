"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Link2,
  LockKeyhole,
  MessageCircleHeart,
  Send,
  Sparkles,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OCCASION_META } from "@/lib/occasion";
import { useSiteLanguage } from "@/hooks/use-site-language";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

const copy = {
  ar: {
    eyebrow: "رسالة بسيطة. مفاجأة مختلفة.",
    title1: "فاجئ شخص مهم",
    title2: "برسالة توصل له",
    title3: "بطريقة مختلفة.",
    sub: "اكتب الرسالة، اختار المناسبة وطريقة فتحها، اقفلها بباسورد، وابعت لينك واحد.",
    cta: "اعمل مفاجأة",
    how: "شوف الخطوات",
    tiny1: "من غير تسجيل",
    tiny2: "محمي بباسورد",
    tiny3: "مناسب للموبايل",
    stepsKicker: "بسيطة",
    stepsTitleA: "3 خطوات.",
    stepsTitleB: "وبس.",
    stepsSub: "اكتب الرسالة، اختار شكل تقديمها، وابعت اللينك.",
    s1: "اكتب الرسالة",
    s1p: "اكتب اللي عايز تقوله بطريقتك، وضيف الإيموجيز اللي تحبها.",
    s2: "اختار طريقة الفتح",
    s2p: "اختار الشكل اللي يناسب الرسالة ويظهر قبل ما تتفتح.",
    s3: "ابعت اللينك",
    s3p: "الشخص يدخل الباسورد ويفتح رسالتك مباشرة.",
    occKicker: "المناسبة",
    occTitle: "اختار اللحظة اللي الرسالة معمولة عشانها.",
    occSub: "اختيارات واضحة وبسيطة، وكل واحدة لها لمستها داخل الرسالة.",
    detailKicker: "التفاصيل",
    detailTitle: "كل حاجة بسيطة. والرسالة هي الأهم.",
    detailSub: "من أول الكتابة لحد اللينك النهائي، التجربة معمولة عشان تفضل شخصية وسهلة.",
    messageLabel: "رسالة لـ مريم",
    messageText: "أنا فخور بيك جدًا، وحبيت أقولها بطريقة تفضل فاكرها 🤍",
    feature1: "إيموجيز من غير ما تسيب الكتابة",
    feature2: "باسورد قبل ظهور الرسالة",
    feature3: "لينك واحد سهل تبعته",
    linkLabel: "لينك المفاجأة",
    finalKicker: "جاهز؟",
    finalTitle: "اكتب حاجة حقيقية لشخص مهم عندك.",
    finalSub: "رسالة صغيرة ممكن تعمل يوم كامل.",
    finalButton: "ابدأ الرسالة",
  },
  en: {
    eyebrow: "A small message. A different surprise.",
    title1: "Surprise someone",
    title2: "with a message",
    title3: "delivered differently.",
    sub: "Write the message, choose the occasion and reveal, protect it with a password, then send one link.",
    cta: "Create a surprise",
    how: "See how it works",
    tiny1: "No sign-up",
    tiny2: "Password protected",
    tiny3: "Made for mobile",
    stepsKicker: "Simple",
    stepsTitleA: "Three steps.",
    stepsTitleB: "That’s it.",
    stepsSub: "Write the message, choose the presentation, and send the link.",
    s1: "Write the message",
    s1p: "Say it your way, then add as many emojis as you like.",
    s2: "Choose the reveal",
    s2p: "Pick the presentation they see before your message opens.",
    s3: "Send the link",
    s3p: "They enter the password and open your message right away.",
    occKicker: "Occasions",
    occTitle: "Choose the moment the message is for.",
    occSub: "Clear options, with a small visual touch for each occasion.",
    detailKicker: "Details",
    detailTitle: "Everything stays simple. The message stays personal.",
    detailSub: "From writing to sharing, every step is designed to keep the experience easy and thoughtful.",
    messageLabel: "A message for Mariam",
    messageText: "I’m really proud of you, and I wanted to say it in a way you’d remember 🤍",
    feature1: "Emojis without leaving the composer",
    feature2: "A password before the message appears",
    feature3: "One clean link to share",
    linkLabel: "Surprise link",
    finalKicker: "Ready?",
    finalTitle: "Send something real to someone important.",
    finalSub: "A small message can make a whole day.",
    finalButton: "Start your message",
  },
};

export default function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { lang, toggleLanguage, isArabic } = useSiteLanguage("ar");
  const t = copy[lang];
  const createHref = `/create?lang=${lang}`;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!rootRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-hero-line]", {
        yPercent: 115,
        opacity: 0,
        duration: 0.9,
        stagger: 0.09,
        ease: "power4.out",
      });
      gsap.from("[data-hero-fade]", {
        y: 18,
        opacity: 0,
        duration: 0.72,
        stagger: 0.08,
        delay: 0.34,
        ease: "power3.out",
      });
      gsap.from(".fy-hero-scene", {
        opacity: 0,
        scale: 0.985,
        y: 14,
        duration: 1.05,
        delay: 0.12,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>("[data-scroll-in]").forEach((el) => {
        gsap.from(el, {
          y: 26,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-step-copy]").forEach((el, i) => {
        gsap.from(el, {
          y: 16,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".fy-steps-canvas", start: "top 78%", once: true },
        });
      });

      gsap.to(".fy-floating-plane", {
        x: 18,
        y: -10,
        rotate: 6,
        duration: 2.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".fy-float-heart", {
        y: -8,
        rotate: -4,
        duration: 2.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="fy-page fy-page-v4" dir={isArabic ? "rtl" : "ltr"}>
      <SiteHeader lang={lang} onToggleLanguage={toggleLanguage} />

      <main>
        <section className="fy-hero-v4">
          <div className="fy-hero-scene" aria-hidden="true" />
          <div className="fy-hero-content-v4">
            <div className="fy-kicker-v4" data-hero-fade><Sparkles size={14} /> {t.eyebrow}</div>
            <h1>
              <span className="fy-line-mask"><span data-hero-line>{t.title1}</span></span>
              <span className="fy-line-mask"><span data-hero-line>{t.title2}</span></span>
              <span className="fy-line-mask fy-line-accent"><span data-hero-line>{t.title3}</span></span>
            </h1>
            <p data-hero-fade>{t.sub}</p>
            <div className="fy-hero-actions-v4" data-hero-fade>
              <Link href={createHref} className="fy-primary-pill">{t.cta} <Sparkles size={17} /></Link>
              <a href="#how" className="fy-secondary-pill">{t.how} <ArrowDown size={16} /></a>
            </div>
            <div className="fy-proof-v4" data-hero-fade>
              <span><LockKeyhole size={15} />{t.tiny1}</span>
              <span><Check size={15} />{t.tiny2}</span>
              <span><MessageCircleHeart size={15} />{t.tiny3}</span>
            </div>
          </div>
        </section>

        <section id="how" className="fy-steps-section-v4">
          <div className="fy-section-title-v4" data-scroll-in>
            <span>{t.stepsKicker}</span>
            <h2>{t.stepsTitleA} <em>{t.stepsTitleB}</em></h2>
            <p>{t.stepsSub}</p>
          </div>

          <div className="fy-steps-canvas" data-scroll-in>
            <div className="fy-floating-plane" aria-hidden="true"><Send size={24} /></div>
            <div className="fy-float-heart" aria-hidden="true">♡</div>
            <div className="fy-step-copy fy-step-copy-1" data-step-copy><h3>{t.s1}</h3><p>{t.s1p}</p></div>
            <div className="fy-step-copy fy-step-copy-2" data-step-copy><h3>{t.s2}</h3><p>{t.s2p}</p></div>
            <div className="fy-step-copy fy-step-copy-3" data-step-copy><h3>{t.s3}</h3><p>{t.s3p}</p></div>
          </div>
        </section>

        <section id="occasions" className="fy-occasions-v4">
          <div className="fy-section-title-v4 fy-section-title-v4--left" data-scroll-in>
            <span>{t.occKicker}</span>
            <h2>{t.occTitle}</h2>
            <p>{t.occSub}</p>
          </div>
          <div className="fy-occasion-grid-v4" data-scroll-in>
            {OCCASION_META.map((item) => (
              <Link
                href={createHref}
                className="fy-occasion-card-v4"
                key={item.key}
                style={{ "--occ-soft": item.soft, "--occ-accent": item.accent } as React.CSSProperties}
              >
                <span className="fy-occasion-emoji-v4">{item.emoji}</span>
                <span><b>{item.label[lang]}</b><small>{item.note[lang]}</small></span>
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </section>

        <section className="fy-personal-v4">
          <div className="fy-personal-copy" data-scroll-in>
            <span>{t.detailKicker}</span>
            <h2>{t.detailTitle}</h2>
            <p>{t.detailSub}</p>
            <div className="fy-personal-points">
              <div><i>01</i><span>{t.feature1}</span></div>
              <div><i>02</i><span>{t.feature2}</span></div>
              <div><i>03</i><span>{t.feature3}</span></div>
            </div>
          </div>

          <div className="fy-personal-stage" data-scroll-in>
            <div className="fy-message-paper">
              <div className="fy-message-paper-top"><span>💌</span><b>{t.messageLabel}</b><i>•••</i></div>
              <div className="fy-message-paper-body">
                <p>{t.messageText}</p>
                <div className="fy-emoji-cloud" aria-hidden="true"><span>🥹</span><span>🫶</span><span>✨</span><span>🤍</span><span>🎉</span></div>
              </div>
            </div>
            <div className="fy-mini-lock-card"><LockKeyhole size={18}/><span>••••••</span><small>{lang === "ar" ? "باسورد خاص" : "Private password"}</small></div>
            <div className="fy-mini-link-card"><Link2 size={18}/><span><small>{t.linkLabel}</small><b>foryou.link/…</b></span></div>
          </div>
        </section>

        <section className="fy-final-v4" data-scroll-in>
          <div className="fy-final-plane" aria-hidden="true"><Send size={32}/></div>
          <span>{t.finalKicker}</span>
          <h2>{t.finalTitle}</h2>
          <p>{t.finalSub}</p>
          <Link href={createHref} className="fy-primary-pill">{t.finalButton} <ArrowUpRight size={17}/></Link>
        </section>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
