"use client";

import Link from "next/link";
import { ArrowUpRight, Facebook, Instagram, Music2 } from "lucide-react";
import type { Language } from "@/lib/occasion";

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/riweb_s", icon: Instagram },
  { label: "TikTok", href: "https://www.tiktok.com/@riwebs?_r=1&_t=ZS-98JlqhtmWA5", icon: Music2 },
  { label: "Facebook", href: "https://www.facebook.com/share/1FPBCjVdJf/?mibextid=wwXIfr", icon: Facebook },
];

export default function SiteFooter({ lang }: { lang: Language }) {
  const ar = lang === "ar";
  return (
    <footer className="fy-footer fy-footer-v4" dir={ar ? "rtl" : "ltr"}>
      <div className="fy-footer-inner">
        <div className="fy-footer-top">
          <div className="fy-footer-brand">
            <div className="fy-brand fy-brand--footer">
              <span className="fy-brand-dot">4U</span>
              <span className="fy-brand-copy">
                <strong>ForYou</strong>
                <small>{ar ? "رسالتك. لحظتهم." : "Your message. Their moment."}</small>
              </span>
            </div>
            <p>{ar ? "رسالة خاصة، باسورد، ولينك واحد يوصلها بشكل مختلف." : "A private message, a password, and one link delivered differently."}</p>
          </div>

          <div className="fy-footer-nav">
            <span>{ar ? "روابط" : "Links"}</span>
            <Link href={`/?lang=${lang}`}>{ar ? "الرئيسية" : "Home"}</Link>
            <a href={`/?lang=${lang}#how`}>{ar ? "الخطوات" : "How it works"}</a>
            <a href={`/?lang=${lang}#occasions`}>{ar ? "المناسبات" : "Occasions"}</a>
            <Link href={`/create?lang=${lang}`}>{ar ? "اعمل مفاجأة" : "Create a surprise"}</Link>
          </div>

          <div className="fy-footer-socials">
            <span>RiWebs</span>
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a href={href} target="_blank" rel="noreferrer" key={label}>
                <Icon size={16} /> {label} <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        </div>

        <div className="fy-footer-bottom">
          <span>© 2026 ForYou</span>
          <a className="fy-designed" href="https://www.instagram.com/riweb_s" target="_blank" rel="noreferrer">
            Designed by RiWebs <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}
