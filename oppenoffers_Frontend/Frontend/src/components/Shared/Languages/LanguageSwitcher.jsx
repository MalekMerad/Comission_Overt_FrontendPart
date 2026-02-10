import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import logo_fr from "../../../assets/logo_fr.png";
import logo_en from "../../../assets/logo_en.png";
import logo_ar from "../../../assets/logo_ar.png";

const languages = [
  { code: "fr", label: "FR", logo: logo_fr },
  { code: "ar", label: "AR", logo: logo_ar },
  { code: "en", label: "EN", logo: logo_en },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const [selectedLang, setSelectedLang] = useState(
    localStorage.getItem("lang") || "fr"
  );
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // RTL / LTR
  useEffect(() => {
    document.documentElement.dir =
      i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  // click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (lang) => {
    setSelectedLang(lang);
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
    setOpen(false);
  };

  const currentLang = languages.find(l => l.code === selectedLang);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-2 h-8 rounded bg-slate-700 hover:bg-slate-600
          border border-slate-600 text-[11px] font-bold transition cursor-pointer
          ${open ? "ring-2 ring-slate-400" : ""}
        `}
      >
        {currentLang?.logo && (
          <img
            src={currentLang.logo}
            alt={currentLang.label}
            className="h-4 w-4 rounded-full"
          />
        )}
        {currentLang?.label}
        <ChevronDown
          size={13}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 mt-1 w-18 bg-white rounded shadow border z-50">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleChange(lang.code)}
              className={`w-full px-3 py-2 text-sm flex items-center gap-2
                hover:bg-blue-100 transition cursor-pointer
                ${selectedLang === lang.code ? "bg-blue-100 text-blue-700" : ""}
              `}
            >
              <img src={lang.logo} className="h-4 w-4 rounded-full" />
              <span className="text-blue-700">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
