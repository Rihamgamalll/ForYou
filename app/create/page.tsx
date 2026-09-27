"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Eye,
  Link2,
  Lock,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { createGift } from "@/lib/gift-service";
import type { ExperienceType, Occasion } from "@/lib/types";
import { OCCASION_META } from "@/lib/occasion";
import { REVEAL_META } from "@/lib/reveal";
import { useSiteLanguage } from "@/hooks/use-site-language";
import SiteHeader from "@/components/site/SiteHeader";
import OccasionReaction from "@/components/site/OccasionReaction";
import RevealExperience from "@/components/site/RevealExperience";

const EMOJIS = [
  "🥹","😭","🫶","😂","💗","✨","🥳","🫂","🤍","😌","🤭","👀",
  "😤","🙈","💀","🤝","🫡","💅","😎","❤️","💞","💘","💐","🎂",
  "🎓","🎉","🥂","🏆","🌷","⭐","🪩","🎀","💌","🧸","🍰","🤏",
  "👉","👈","🫠","😚","😘","😔","😩","🪄","🌟","💫","🌸","🌹",
  "🌻","🎈","🎁","🍓","☕","🧡","💛","💚","💙","💜","🩷","🩵",
  "🤎","🖤","👏","🙌","🤍","🫶🏻","🥰","😊","😁","😅","🤗","😇",
];

const QUICK_LINES = {
  ar: ["حبيت أقولك حاجة…", "أنا فخور بيك جدًا 🤍", "شكرًا على كل حاجة 🫶"],
  en: ["I wanted to tell you something…", "I'm really proud of you 🤍", "Thank you for everything 🫶"],
};

interface FormData {
  recipientName: string;
  occasion: Occasion | null;
  message: string;
  experienceType: ExperienceType | null;
  password: string;
  confirmPassword: string;
  passwordHint: string;
  creatorName: string;
}

const initialForm: FormData = {
  recipientName: "",
  occasion: null,
  message: "",
  experienceType: null,
  password: "",
  confirmPassword: "",
  passwordHint: "",
  creatorName: "",
};

const pageCopy = {
  ar: {
    top: "إنشاء مفاجأة",
    steps: ["الشخص", "المناسبة", "الرسالة", "طريقة الفتح", "الحماية", "جاهزة"],
    next: "التالي",
    back: "رجوع",
    personOver: "1 · الشخص",
    personTitle: "هتبعتها لمين؟",
    personSub: "اكتب الاسم الأول.",
    personPlaceholder: "مثلاً: مريم",
    personEmpty: "الاسم هيظهر داخل الرسالة.",
    personReady: (name: string) => `هنجهز الرسالة لـ ${name}.`,
    occOver: "2 · المناسبة",
    occTitle: "اختار المناسبة",
    occSub: "اختار أقرب مناسبة للرسالة.",
    msgOver: "3 · الرسالة",
    msgTitle: "اكتب رسالتك",
    msgSub: "اكتبها بطريقتك، قصيرة أو طويلة.",
    emojiLabel: "إيموجيز",
    quick: "بدايات مقترحة",
    msgPlaceholder: (name: string) => `${name || "الاسم"}…\n\nحبيت أقولك…`,
    revealOver: "4 · طريقة الفتح",
    revealTitle: "اختار شكل فتح الرسالة",
    revealSub: "اختار الشكل اللي هيظهر للشخص قبل ما يقرأ الرسالة.",
    chooseReveal: "اختار طريقة من القائمة",
    lockOver: "5 · الحماية",
    lockTitle: "اختار باسورد",
    lockSub: "الشخص هيحتاجه عشان يفتح الرسالة.",
    password: "الباسورد",
    passwordHint: "تلميح اختياري",
    confirm: "تأكيد الباسورد",
    yourName: "اسمك — اختياري",
    passwordPh: "3 حروف على الأقل",
    confirmPh: "اكتب نفس الباسورد",
    hintPh: "مثلاً: أول مكان اتقابلنا فيه",
    namePh: "مثلاً: سارة",
    safe: "الرسالة لا تظهر قبل إدخال الباسورد الصحيح.",
    create: "إنشاء المفاجأة",
    creating: "جاري الإنشاء…",
    doneTag: "تم",
    doneTitle: "المفاجأة جاهزة",
    doneSub: "ابعت اللينك والباسورد للشخص.",
    link: "لينك المفاجأة",
    openLink: "فتح اللينك",
    copyLink: "نسخ اللينك",
    copyPass: "نسخ الباسورد",
    copied: "تم النسخ",
    whatsapp: "إرسال على واتساب",
    share: "مشاركة",
    previewGift: "معاينة",
    another: "إنشاء واحدة جديدة",
    localNotice: "أنت فاتح الموقع محليًا. عشان اللينك يفتح عند شخص تاني، انشر الموقع واضبط NEXT_PUBLIC_SITE_URL على رابط https الخاص بالموقع.",
  },
  en: {
    top: "Create a surprise",
    steps: ["Person", "Occasion", "Message", "Reveal", "Privacy", "Done"],
    next: "Continue",
    back: "Back",
    personOver: "1 · PERSON",
    personTitle: "Who is this for?",
    personSub: "A first name is enough.",
    personPlaceholder: "e.g. Mariam",
    personEmpty: "Their name will appear inside the message.",
    personReady: (name: string) => `We'll prepare the message for ${name}.`,
    occOver: "2 · OCCASION",
    occTitle: "Choose the occasion",
    occSub: "Pick the option that best fits the message.",
    msgOver: "3 · MESSAGE",
    msgTitle: "Write your message",
    msgSub: "Keep it short or make it long. Write it your way.",
    emojiLabel: "Emojis",
    quick: "Suggested openings",
    msgPlaceholder: (name: string) => `${name || "Hey"}…\n\nI wanted to tell you…`,
    revealOver: "4 · REVEAL",
    revealTitle: "Choose how they open it",
    revealSub: "Choose the presentation they see before reading your message.",
    chooseReveal: "Choose a reveal from the list",
    lockOver: "5 · PRIVACY",
    lockTitle: "Choose a password",
    lockSub: "They'll need it before the message is shown.",
    password: "Password",
    passwordHint: "Optional hint",
    confirm: "Confirm password",
    yourName: "Your name — optional",
    passwordPh: "At least 3 characters",
    confirmPh: "Type the same password",
    hintPh: "e.g. where we first met",
    namePh: "e.g. Sara",
    safe: "The message stays hidden until the correct password is entered.",
    create: "Create surprise",
    creating: "Creating…",
    doneTag: "Done",
    doneTitle: "Your surprise is ready",
    doneSub: "Send the link and password to the person.",
    link: "Surprise link",
    openLink: "Open link",
    copyLink: "Copy link",
    copyPass: "Copy password",
    copied: "Copied",
    whatsapp: "Send on WhatsApp",
    share: "Share",
    previewGift: "Preview",
    another: "Create another",
    localNotice: "You're running the site locally. To make the link work for someone else, deploy the site and set NEXT_PUBLIC_SITE_URL to your public https URL.",
  },
};

export default function CreatePage() {
  const router = useRouter();
  const { lang, toggleLanguage, isArabic } = useSiteLanguage("ar");
  const t = pageCopy[lang];
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [createdPassword, setCreatedPassword] = useState("");
  const [copied, setCopied] = useState<"link" | "password" | null>(null);

  const goTo = (nextStep: number, dir: number) => {
    setError("");
    setDirection(dir);
    setStep(nextStep);
  };

  const next = () => {
    setError("");
    if (step === 0 && !formData.recipientName.trim()) return setError(isArabic ? "اكتب اسم الشخص أولًا." : "Enter the person's name first.");
    if (step === 1 && !formData.occasion) return setError(isArabic ? "اختار المناسبة أولًا." : "Choose an occasion first.");
    if (step === 2 && formData.message.trim().length < 5) return setError(isArabic ? "اكتب رسالة أطول قليلًا." : "Write a slightly longer message.");
    if (step === 3 && !formData.experienceType) return setError(isArabic ? "اختار طريقة الفتح أولًا." : "Choose a reveal first.");
    goTo(Math.min(step + 1, 4), 1);
  };

  const prev = () => goTo(Math.max(step - 1, 0), -1);

  const appendMessage = (value: string) => {
    const spacer = formData.message && !formData.message.endsWith(" ") && !formData.message.endsWith("\n") ? " " : "";
    setFormData({ ...formData, message: `${formData.message}${spacer}${value}` });
  };

  const handleCreate = async () => {
    setError("");
    if (formData.password.length < 3) return setError(isArabic ? "الباسورد لازم يكون 3 حروف على الأقل." : "Password must be at least 3 characters.");
    if (formData.password !== formData.confirmPassword) return setError(isArabic ? "تأكيد الباسورد غير مطابق." : "The passwords do not match.");
    if (!formData.experienceType || !formData.occasion) return;

    setCreating(true);
    try {
      const gift = await createGift({
        recipientName: formData.recipientName,
        message: formData.message,
        occasion: formData.occasion,
        experienceType: formData.experienceType,
        password: formData.password,
        passwordHint: formData.passwordHint || undefined,
        creatorName: formData.creatorName || undefined,
      });
      setCreatedId(gift.id);
      setCreatedPassword(formData.password);
      goTo(5, 1);
    } catch {
      setError(isArabic ? "حصل خطأ أثناء إنشاء المفاجأة. جرّب مرة أخرى." : "Something went wrong while creating the surprise. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const browserOrigin = typeof window !== "undefined" ? window.location.origin : "";
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";
  const shareOrigin = configuredOrigin || browserOrigin;
  const shareUrl = createdId ? `${shareOrigin}/gift/${createdId}?lang=${lang}` : "";
  const isLocalShare = !!shareUrl && /localhost|127\.0\.0\.1/i.test(shareUrl);
  const whatsappText = isArabic
    ? `عملتلك مفاجأة صغيرة 🤍\nافتحها من هنا:\n${shareUrl}\n\nالباسورد: ${createdPassword}`
    : `I made you a little surprise 🤍\nOpen it here:\n${shareUrl}\n\nPassword: ${createdPassword}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  const copyToClipboard = async (text: string, type: "link" | "password") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 1600);
    } catch {}
  };

  const shareNative = async () => {
    if (!shareUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: "ForYou", text: isArabic ? "مفاجأة صغيرة ليك 🤍" : "A little surprise for you 🤍", url: shareUrl });
        return;
      } catch {}
    }
    await copyToClipboard(shareUrl, "link");
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 26 : -26, opacity: 0, filter: "blur(4px)" }),
    center: { x: 0, opacity: 1, filter: "blur(0px)" },
    exit: (dir: number) => ({ x: dir > 0 ? -22 : 22, opacity: 0, filter: "blur(3px)" }),
  };

  return (
    <div className="create-page" dir={isArabic ? "rtl" : "ltr"}>
      <SiteHeader lang={lang} onToggleLanguage={toggleLanguage} compact />

      <main className="create-wrap">
        <div className="create-topline">
          <Link href={`/?lang=${lang}`} className="create-home-link">{isArabic ? "← الرئيسية" : "← Home"}</Link>
          <span>{t.top}</span>
        </div>

        <div className="create-progress-row" aria-label={isArabic ? "تقدم إنشاء المفاجأة" : "Creation progress"}>
          {t.steps.map((label, index) => (
            <button
              key={label}
              className={`create-progress-step ${index === step ? "active" : ""} ${index < step ? "done" : ""}`}
              onClick={() => index < step && goTo(index, -1)}
              disabled={index > step || step === 5}
            >
              <i>{index < step ? <Check size={12}/> : index + 1}</i><span>{label}</span>
            </button>
          ))}
          <div className="create-progress-track"><div style={{ width: `${(step / 5) * 100}%` }} /></div>
        </div>

        <section className="create-card">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="create-stage-inner"
            >
              {step === 0 && (
                <StepHead overline={t.personOver} title={t.personTitle} subtitle={t.personSub}>
                  <div className="create-name-stage">
                    <input
                      autoFocus
                      className="create-name-input"
                      value={formData.recipientName}
                      onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && next()}
                      placeholder={t.personPlaceholder}
                    />
                    <div className="create-name-reaction">{formData.recipientName ? t.personReady(formData.recipientName) : t.personEmpty}</div>
                  </div>
                </StepHead>
              )}

              {step === 1 && (
                <StepHead overline={t.occOver} title={t.occTitle} subtitle={t.occSub}>
                  <div className="create-occasion-grid">
                    {OCCASION_META.map((occ) => (
                      <button
                        key={occ.key}
                        className={`create-occasion-card ${formData.occasion === occ.key ? "selected" : ""}`}
                        onClick={() => setFormData({ ...formData, occasion: occ.key })}
                        style={{ "--occ-accent": occ.accent, "--occ-soft": occ.soft } as React.CSSProperties}
                      >
                        <OccasionReaction meta={occ} lang={lang} compact />
                        <span className="create-occasion-copy"><b>{occ.label[lang]}</b><small>{occ.note[lang]}</small></span>
                        <i className="create-occasion-check">{formData.occasion === occ.key ? "✓" : ""}</i>
                      </button>
                    ))}
                  </div>
                </StepHead>
              )}

              {step === 2 && (
                <StepHead overline={t.msgOver} title={t.msgTitle} subtitle={t.msgSub}>
                  <div className="message-box">
                    <div className="message-emoji-head"><span>{t.emojiLabel}</span><span>{EMOJIS.length}</span></div>
                    <div className="message-emoji-tray no-scrollbar">
                      {EMOJIS.map((emoji, index) => <button key={`${emoji}-${index}`} onClick={() => appendMessage(emoji)} aria-label={`Add ${emoji}`}>{emoji}</button>)}
                    </div>
                    <textarea
                      autoFocus
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t.msgPlaceholder(formData.recipientName)}
                      maxLength={1000}
                    />
                    <div className="message-box-meta"><span>{formData.message.length}/1000</span></div>
                  </div>
                  <div className="quick-lines"><span>{t.quick}</span><div>{QUICK_LINES[lang].map((line) => <button key={line} onClick={() => appendMessage(line)}>{line}</button>)}</div></div>
                </StepHead>
              )}

              {step === 3 && (
                <StepHead overline={t.revealOver} title={t.revealTitle} subtitle={t.revealSub}>
                  <div className="reveal-layout-v4">
                    <div className="reveal-options-v4">
                      {REVEAL_META.map((exp, index) => (
                        <button
                          key={exp.type}
                          className={`reveal-choice-v4 reveal-choice-v4--${exp.tone} ${formData.experienceType === exp.type ? "selected" : ""}`}
                          onClick={() => setFormData({ ...formData, experienceType: exp.type })}
                        >
                          <span className="reveal-choice-number">0{index + 1}</span>
                          <span className="reveal-choice-copy"><b>{exp.label[lang]}</b><small>{exp.short[lang]}</small></span>
                          <span className="reveal-choice-check">{formData.experienceType === exp.type ? "✓" : ""}</span>
                        </button>
                      ))}
                    </div>
                    <div className="reveal-preview-v4">
                      {formData.experienceType ? (
                        <RevealExperience type={formData.experienceType} lang={lang} />
                      ) : (
                        <div className="reveal-empty-v4"><span>✦</span><b>{t.chooseReveal}</b></div>
                      )}
                    </div>
                  </div>
                </StepHead>
              )}

              {step === 4 && (
                <StepHead overline={t.lockOver} title={t.lockTitle} subtitle={t.lockSub}>
                  <div className="lock-grid">
                    <label><span>{t.password}</span><input autoFocus type="password" value={formData.password} onChange={(e)=>setFormData({...formData,password:e.target.value})} placeholder={t.passwordPh}/></label>
                    <label><span>{t.confirm}</span><input type="password" value={formData.confirmPassword} onChange={(e)=>setFormData({...formData,confirmPassword:e.target.value})} placeholder={t.confirmPh}/></label>
                    <label><span>{t.passwordHint}</span><input value={formData.passwordHint} onChange={(e)=>setFormData({...formData,passwordHint:e.target.value})} placeholder={t.hintPh}/></label>
                    <label><span>{t.yourName}</span><input value={formData.creatorName} onChange={(e)=>setFormData({...formData,creatorName:e.target.value})} placeholder={t.namePh}/></label>
                  </div>
                  <div className="lock-note"><ShieldCheck size={17}/><span>{t.safe}</span></div>
                </StepHead>
              )}

              {step === 5 && (
                <div className="create-success">
                  <div className="create-success-emoji">✓</div>
                  <span>{t.doneTag}</span>
                  <h1>{t.doneTitle}</h1>
                  <p>{t.doneSub}</p>
                  <div className="share-url">
                    <small>{t.link}</small>
                    <a href={shareUrl} target="_blank" rel="noopener noreferrer" dir="ltr"><Link2 size={15}/><span>{shareUrl}</span></a>
                  </div>
                  {isLocalShare && <div className="share-local-warning">{t.localNotice}</div>}
                  <div className="share-actions share-actions--primary">
                    <a className="whatsapp-share" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={16}/>{t.whatsapp}</a>
                    <button onClick={shareNative}><Send size={16}/>{t.share}</button>
                  </div>
                  <div className="share-actions">
                    <button onClick={() => copyToClipboard(shareUrl, "link")}>{copied === "link" ? <Check size={16}/> : <Copy size={16}/>} {copied === "link" ? t.copied : t.copyLink}</button>
                    <button onClick={() => copyToClipboard(createdPassword, "password")}>{copied === "password" ? <Check size={16}/> : <Lock size={16}/>} {copied === "password" ? t.copied : t.copyPass}</button>
                    <button onClick={() => router.push(`/gift/${createdId}?lang=${lang}`)}><Eye size={16}/>{t.previewGift}</button>
                  </div>
                  <button className="create-another" onClick={() => { setFormData(initialForm); setCreatedId(null); goTo(0, -1); }}>{t.another}</button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {error && <motion.div className="create-error" initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}>{error}</motion.div>}

          {step < 5 && (
            <div className="create-controls">
              <button onClick={prev} disabled={step === 0}>{isArabic ? <ArrowRight size={16}/> : <ArrowLeft size={16}/>} {t.back}</button>
              {step < 4 ? (
                <button className="primary" onClick={next}>{t.next} {isArabic ? <ArrowLeft size={16}/> : <ArrowRight size={16}/>}</button>
              ) : (
                <button className="primary" onClick={handleCreate} disabled={creating}>{creating ? t.creating : t.create} {!creating && <Sparkles size={15}/>}</button>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StepHead({ overline, title, subtitle, children }: { overline: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <>
      <div className="create-step-head"><span>{overline}</span><h1>{title}</h1><p>{subtitle}</p></div>
      {children}
    </>
  );
}
