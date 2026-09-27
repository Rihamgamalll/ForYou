"use client";

import { useEffect, useState } from "react";
import type { Language } from "@/lib/occasion";

const STORAGE_KEY = "foryou-language";

export function useSiteLanguage(defaultLanguage: Language = "ar") {
  const [lang, setLang] = useState<Language>(defaultLanguage);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("lang") as Language | null;
    const saved = window.localStorage.getItem(STORAGE_KEY) as Language | null;

    if (fromUrl === "ar" || fromUrl === "en") setLang(fromUrl);
    else if (saved === "ar" || saved === "en") setLang(saved);

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    const url = new URL(window.location.href);
    if (url.searchParams.get("lang") !== lang) {
      url.searchParams.set("lang", lang);
      window.history.replaceState({}, "", `${url.pathname}?${url.searchParams.toString()}${url.hash}`);
    }
  }, [lang, ready]);

  const toggleLanguage = () => setLang((current) => (current === "ar" ? "en" : "ar"));

  return { lang, setLang, toggleLanguage, isArabic: lang === "ar", ready };
}
