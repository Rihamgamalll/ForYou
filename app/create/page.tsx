"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  Link2,
  Lock,
  MessageCircle,
  Send,
  SmilePlus,
} from "lucide-react";
import { createGift } from "@/lib/gift-service";
import type { ExperienceType, Occasion } from "@/lib/types";
import { OCCASION_META } from "@/lib/occasion";
import { REVEAL_META } from "@/lib/reveal";
import { useSiteLanguage } from "@/hooks/use-site-language";
import SiteHeader from "@/components/site/SiteHeader";
import RevealExperience from "@/components/site/RevealExperience";

const EMOJIS = [
  "🥹","😭","🫶","😂","💗","✨","🥳","🫂","🤍","😌","🤭","👀",
  "😤","🙈","💀","🤝","🫡","💅","😎","❤️","💞","💘","💐","🎂",
  "🎓","🎉","🥂","🏆","🌷","⭐","🪩","🎀","💌","🧸","🍰","🤏",
  "👉","👈","🫠","😚","😘","😔","😩","🪄","🌟","💫","🌸","🌹",
  "🌻","🎈","🎁","🍓","☕","🧡","💛","💚","💙","💜","🩷","🩵",
  "🤎","🖤","👏","🙌","🫶🏻","🥰","😊","😁","😅","🤗","😇",
];

interface FormData {
  recipientName: string;
  occasion: Occasion | null;
  message: string;
  experienceType: ExperienceType;
  password: string;
  confirmPassword: string;
  passwordHint: string;
  creatorName: string;
}

const initialForm: FormData = {
  recipientName: "",
  occasion: null,
  message: "",
  experienceType: "envelope",
  password: "",
  confirmPassword: "",
  passwordHint: "",
  creatorName: "",
};

const copy = {
  ar: {
    top: "إنشاء رسالة",
    home: "الرئيسية",
    stepOf: (n: number) => `${String(n).padStart(2, "0")} / 04`,
    next: "التالي",
    back: "رجوع",
    detailsTitle: "ابدأ بالتفاصيل",
    detailsSub: "الاسم والمناسبة فقط.",
    nameLabel: "الاسم",
    namePlaceholder: "اكتب الاسم",
    occasionLabel: "المناسبة",
    messageTitle: "اكتب رسالتك",
    messageSub: "اكتبها كما تحب.",
    messagePlaceholder: "اكتب هنا…",
    emoji: "إيموجيز",
    revealTitle: "اختار شكل الفتح",
    revealSub: "اختار الشكل الأقرب للجو اللي عايزه.",
    privacyTitle: "حماية الرسالة",
    privacySub: "حط باسورد قبل إرسال الرابط.",
    password: "الباسورد",
    confirm: "تأكيد الباسورد",
    passwordPh: "3 حروف على الأقل",
    confirmPh: "اكتب نفس الباسورد",
    optional: "خيارات إضافية",
    hint: "تلميح — اختياري",
    hintPh: "تلميح بسيط",
    sender: "اسم المرسل — اختياري",
    senderPh: "اسمك",
    create: "إنشاء الرابط",
    creating: "جاري الإنشاء…",
    doneTitle: "جاهزة للإرسال.",
    doneSub: "ابعت الرابط والباسورد للشخص.",
    link: "الرابط",
    passwordLabel: "الباسورد",
    copy: "نسخ",
    copied: "تم النسخ",
    whatsapp: "واتساب",
    share: "مشاركة",
    preview: "معاينة",
    another: "رسالة جديدة",
    localNotice: "الرابط الحالي محلي. افتح النسخة المنشورة قبل المشاركة.",
  },
  en: {
    top: "Create a message",
    home: "Home",
    stepOf: (n: number) => `${String(n).padStart(2, "0")} / 04`,
    next: "Continue",
    back: "Back",
    detailsTitle: "Start with the details",
    detailsSub: "Just the name and occasion.",
    nameLabel: "Name",
    namePlaceholder: "Enter a name",
    occasionLabel: "Occasion",
    messageTitle: "Write your message",
    messageSub: "Say it your way.",
    messagePlaceholder: "Write here…",
    emoji: "Emojis",
    revealTitle: "Choose how it opens",
    revealSub: "Pick the style that fits the moment.",
    privacyTitle: "Protect the message",
    privacySub: "Add a password before you send the link.",
    password: "Password",
    confirm: "Confirm password",
    passwordPh: "At least 3 characters",
    confirmPh: "Type the same password",
    optional: "Optional details",
    hint: "Hint — optional",
    hintPh: "A short hint",
    sender: "Sender name — optional",
    senderPh: "Your name",
    create: "Create link",
    creating: "Creating…",
    doneTitle: "Ready to send.",
    doneSub: "Send the link and password to the recipient.",
    link: "Link",
    passwordLabel: "Password",
    copy: "Copy",
    copied: "Copied",
    whatsapp: "WhatsApp",
    share: "Share",
    preview: "Preview",
    another: "New message",
    localNotice: "This is a local link. Open the deployed site before sharing.",
  },
};

export default function CreatePage() {
  const router = useRouter();
  const { lang, toggleLanguage, isArabic } = useSiteLanguage("ar");
  const t = copy[lang];
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [createdPassword, setCreatedPassword] = useState("");
  const [copied, setCopied] = useState<"link" | "password" | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [optionalOpen, setOptionalOpen] = useState(false);

  const goTo = (nextStep: number, dir: number) => {
    setError("");
    setDirection(dir);
    setStep(nextStep);
  };

  const next = () => {
    setError("");
    if (step === 0) {
      if (!formData.recipientName.trim()) return setError(isArabic ? "اكتب الاسم أولًا." : "Enter the name first.");
      if (!formData.occasion) return setError(isArabic ? "اختار المناسبة." : "Choose an occasion.");
    }
    if (step === 1 && formData.message.trim().length < 5) {
      return setError(isArabic ? "اكتب رسالة أطول قليلًا." : "Write a slightly longer message.");
    }
    goTo(Math.min(step + 1, 3), 1);
  };

  const prev = () => goTo(Math.max(step - 1, 0), -1);

  const appendMessage = (value: string) => {
    const spacer = formData.message && !formData.message.endsWith(" ") && !formData.message.endsWith("\n") ? " " : "";
    setFormData({ ...formData, message: `${formData.message}${spacer}${value}` });
  };

  const handleCreate = async () => {
    setError("");
    if (formData.password.length < 3) {
      return setError(isArabic ? "الباسورد لازم يكون 3 حروف على الأقل." : "Password must be at least 3 characters.");
    }
    if (formData.password !== formData.confirmPassword) {
      return setError(isArabic ? "تأكيد الباسورد غير مطابق." : "The passwords do not match.");
    }
    if (!formData.occasion) return;

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
      goTo(4, 1);
    } catch {
      setError(isArabic ? "تعذر إنشاء الرابط الآن. حاول مرة أخرى." : "The link couldn't be created right now. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const browserOrigin = typeof window !== "undefined" ? window.location.origin.replace(/\/$/, "") : "";
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || "";
  const productionOrigin = configuredOrigin || "https://foryou-ri-webs.vercel.app";
  const shareOrigin = /localhost|127\.0\.0\.1/i.test(browserOrigin) || !browserOrigin
    ? productionOrigin
    : browserOrigin;
  const shareUrl = createdId ? `${shareOrigin}/gift/${createdId}?lang=${lang}` : "";
  const isLocalShare = false;
  const giftEmoji = "\u{1F48C}";
  const whatsappText = isArabic
    ? `عندي رسالة ليك ${giftEmoji}\n${shareUrl}\n\nالباسورد: ${createdPassword}`
    : `I made a message for you ${giftEmoji}\n${shareUrl}\n\nPassword: ${createdPassword}`;
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
        await navigator.share({
          title: "ForYou",
          text: isArabic ? `رسالة خاصة ليك ${giftEmoji}` : `A private message for you ${giftEmoji}`,
          url: shareUrl,
        });
        return;
      } catch {}
    }
    await copyToClipboard(shareUrl, "link");
  };

  const variants = {
    enter: (dir: number) => ({ y: dir > 0 ? 12 : -8, opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (dir: number) => ({ y: dir > 0 ? -8 : 12, opacity: 0 }),
  };

  const activeReveal = REVEAL_META.find((item) => item.type === formData.experienceType) ?? REVEAL_META[0];

  return (
    <div className="create-page create-page-v6" dir={isArabic ? "rtl" : "ltr"}>
      <SiteHeader lang={lang} onToggleLanguage={toggleLanguage} compact />

      <main className="create-shell-v6">
        <div className="create-nav-v6">
          <Link href={`/?lang=${lang}`} className="create-back-home-v6">
            {isArabic ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
            {t.home}
          </Link>
          {step < 4 && <span>{t.stepOf(step + 1)}</span>}
        </div>

        {step < 4 && (
          <div className="create-progress-v6" aria-hidden="true">
            <span style={{ width: `${((step + 1) / 4) * 100}%` }} />
          </div>
        )}

        <section className={`create-panel-v6 ${step === 4 ? "create-panel-v6--done" : ""}`}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="create-stage-v6"
            >
              {step === 0 && (
                <StepHead title={t.detailsTitle} subtitle={t.detailsSub}>
                  <div className="details-grid-v6">
                    <label className="field-v6 field-v6--name">
                      <span>{t.nameLabel}</span>
                      <input
                        autoFocus
                        value={formData.recipientName}
                        onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                        placeholder={t.namePlaceholder}
                      />
                    </label>

                    <div className="occasion-block-v6">
                      <span className="field-label-v6">{t.occasionLabel}</span>
                      <div className="occasion-grid-v6">
                        {OCCASION_META.map((occ) => (
                          <button
                            type="button"
                            key={occ.key}
                            className={`occasion-chip-v6 ${formData.occasion === occ.key ? "selected" : ""}`}
                            onClick={() => setFormData({ ...formData, occasion: occ.key })}
                          >
                            <span>{occ.emoji}</span>
                            <b>{occ.label[lang]}</b>
                            {formData.occasion === occ.key && <Check size={14} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </StepHead>
              )}

              {step === 1 && (
                <StepHead title={t.messageTitle} subtitle={t.messageSub}>
                  <div className="message-envelope-v6">
                    <div className="message-envelope-flap-v6" aria-hidden="true" />
                    <div className="message-paper-v6">
                      <div className="message-paper-head-v6">
                        <button type="button" onClick={() => setEmojiOpen((value) => !value)}>
                          <SmilePlus size={16} />
                          {t.emoji}
                          {emojiOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        <span>{formData.message.length}/1000</span>
                      </div>

                      <AnimatePresence initial={false}>
                        {emojiOpen && (
                          <motion.div
                            className="emoji-tray-v6 no-scrollbar"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                          >
                            {EMOJIS.map((emoji, index) => (
                              <button type="button" key={`${emoji}-${index}`} onClick={() => appendMessage(emoji)}>{emoji}</button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <textarea
                        autoFocus
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={t.messagePlaceholder}
                        maxLength={1000}
                      />
                    </div>
                  </div>
                </StepHead>
              )}

              {step === 2 && (
                <StepHead title={t.revealTitle} subtitle={t.revealSub}>
                  <div className="reveal-picker-v6">
                    <div className="reveal-main-v6">
                      <RevealExperience type={formData.experienceType} lang={lang} />
                    </div>
                    <div className="reveal-strip-v6 no-scrollbar" role="list">
                      {REVEAL_META.map((exp) => (
                        <button
                          type="button"
                          key={exp.type}
                          className={`reveal-tile-v6 ${formData.experienceType === exp.type ? "selected" : ""}`}
                          onClick={() => setFormData({ ...formData, experienceType: exp.type })}
                          aria-label={exp.label[lang]}
                        >
                          <img className={`reveal-tile-image-v7 reveal-tile-image-v7--${exp.type}`} src={exp.image} alt="" referrerPolicy="no-referrer" />
                          <span><b>{exp.label[lang]}</b><small>{exp.short[lang]}</small></span>
                          {formData.experienceType === exp.type && <i><Check size={13} /></i>}
                        </button>
                      ))}
                    </div>
                    <div className="reveal-selected-v6">
                      <span>{activeReveal.label[lang]}</span>
                    </div>
                  </div>
                </StepHead>
              )}

              {step === 3 && (
                <StepHead title={t.privacyTitle} subtitle={t.privacySub}>
                  <div className="privacy-form-v6">
                    <div className="privacy-row-v6">
                      <label className="field-v6">
                        <span>{t.password}</span>
                        <input
                          autoFocus
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder={t.passwordPh}
                        />
                      </label>
                      <label className="field-v6">
                        <span>{t.confirm}</span>
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          placeholder={t.confirmPh}
                        />
                      </label>
                    </div>

                    <button type="button" className="optional-toggle-v6" onClick={() => setOptionalOpen((value) => !value)}>
                      <span>{t.optional}</span>
                      {optionalOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>

                    <AnimatePresence initial={false}>
                      {optionalOpen && (
                        <motion.div
                          className="privacy-row-v6 privacy-row-v6--optional"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                        >
                          <label className="field-v6">
                            <span>{t.hint}</span>
                            <input value={formData.passwordHint} onChange={(e) => setFormData({ ...formData, passwordHint: e.target.value })} placeholder={t.hintPh} />
                          </label>
                          <label className="field-v6">
                            <span>{t.sender}</span>
                            <input value={formData.creatorName} onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })} placeholder={t.senderPh} />
                          </label>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="privacy-note-v6"><Lock size={14} /><span>{isArabic ? "الرسالة لا تظهر قبل إدخال الباسورد." : "The message stays hidden until the password is entered."}</span></div>
                  </div>
                </StepHead>
              )}

              {step === 4 && (
                <div className="done-v6">
                  <div className="done-mark-v6"><Check size={22} /></div>
                  <h1>{t.doneTitle}</h1>
                  <p>{t.doneSub}</p>

                  <div className="share-box-v6">
                    <div className="share-field-v6">
                      <small>{t.link}</small>
                      <div>
                        <Link2 size={16} />
                        <a href={shareUrl} target="_blank" rel="noopener noreferrer" dir="ltr">{shareUrl}</a>
                        <button type="button" onClick={() => copyToClipboard(shareUrl, "link")}>
                          {copied === "link" ? <Check size={15} /> : <Copy size={15} />}
                        </button>
                      </div>
                    </div>
                    <div className="share-field-v6 share-field-v6--pass">
                      <small>{t.passwordLabel}</small>
                      <div>
                        <Lock size={16} />
                        <span dir="ltr">{createdPassword}</span>
                        <button type="button" onClick={() => copyToClipboard(createdPassword, "password")}>
                          {copied === "password" ? <Check size={15} /> : <Copy size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {isLocalShare && <div className="local-note-v6">{t.localNotice}</div>}

                  <div className="share-buttons-v6">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="share-primary-v6"><MessageCircle size={17} />{t.whatsapp}</a>
                    <button type="button" onClick={shareNative}><Send size={16} />{t.share}</button>
                    <button type="button" onClick={() => router.push(`/gift/${createdId}?lang=${lang}`)}><Eye size={16} />{t.preview}</button>
                  </div>

                  <button
                    type="button"
                    className="new-message-v6"
                    onClick={() => {
                      setFormData(initialForm);
                      setCreatedId(null);
                      setCreatedPassword("");
                      setOptionalOpen(false);
                      setEmojiOpen(false);
                      goTo(0, -1);
                    }}
                  >
                    {t.another}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {error && <motion.div className="create-error-v6" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>{error}</motion.div>}

          {step < 4 && (
            <div className="create-actions-v6">
              <button type="button" className="back-v6" onClick={prev} disabled={step === 0}>
                {isArabic ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                {t.back}
              </button>
              {step < 3 ? (
                <button type="button" className="next-v6" onClick={next}>
                  {t.next}
                  {isArabic ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </button>
              ) : (
                <button type="button" className="next-v6" onClick={handleCreate} disabled={creating}>
                  {creating ? t.creating : t.create}
                  {!creating && (isArabic ? <ArrowLeft size={16} /> : <ArrowRight size={16} />)}
                </button>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StepHead({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <>
      <div className="step-head-v6">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </>
  );
}
