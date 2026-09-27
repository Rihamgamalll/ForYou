"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Language } from "@/lib/occasion";

export default function SiteHeader({
  lang,
  onToggleLanguage,
  compact = false,
}: {
  lang: Language;
  onToggleLanguage: () => void;
  compact?: boolean;
}) {
  const ar = lang === "ar";
  const homeHref = `/?lang=${lang}`;
  const createHref = `/create?lang=${lang}`;

  return (
    <header className={`fy-header ${compact ? "fy-header--compact" : ""}`} dir={ar ? "rtl" : "ltr"}>
      <Link href={homeHref} className="fy-brand" aria-label="ForYou home">
        <span className="fy-brand-dot">4U</span>
        <span className="fy-brand-copy">
          <strong>ForYou</strong>
          <small>{ar ? "رسالة منك. لحظة ليه." : "Your message. Their moment."}</small>
        </span>
      </Link>

      {!compact && (
        <nav className="fy-nav-links" aria-label={ar ? "التنقل الرئيسي" : "Main navigation"}>
          <a href={`/?lang=${lang}#how`}>{ar ? "الخطوات" : "How it works"}</a>
          <a href={`/?lang=${lang}#occasions`}>{ar ? "المناسبات" : "Occasions"}</a>
        </nav>
      )}

      <div className="fy-header-actions">
        <button className="fy-lang" onClick={onToggleLanguage} aria-label={ar ? "Switch to English" : "التبديل للعربية"}>
          <span className={ar ? "active" : ""}>ع</span>
          <i />
          <span className={!ar ? "active" : ""}>EN</span>
        </button>
        {!compact && (
          <Link href={createHref} className="fy-button fy-button--small fy-button--ink">
            {ar ? "ابدأ" : "Create"} <ArrowUpRight size={15} />
          </Link>
        )}
      </div>
    </header>
  );
}
