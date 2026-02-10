import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IoLogOutOutline } from "react-icons/io5";
import { ChevronDown } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { FileText, User, UserCheck, ClipboardList, FilesIcon } from 'lucide-react';

import logoSidebar from '../../assets/logo_sidebar.png';
import LanguageSwitcher from "../Shared/Languages/LanguageSwitcher";

const sections = [
  { id: 'operations', labelKey: "sidebar.operations", icon: FileText },
  { id: 'supplier', labelKey: "sidebar.suppliers", icon: User },
  { id: 'commission', labelKey: "sidebar.commission", icon: UserCheck },
  { id: 'evaluation', labelKey: "sidebar.evaluation", icon: ClipboardList },
];

export function Sidebar({ activeSection, onSectionChange }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useTranslation();

  const [selectedLang, setSelectedLang] = useState(localStorage.getItem('lang') || 'fr');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langRef = useRef(null);

  const handleDeconnection = () => {
    localStorage.clear();
    logout();
    navigate('/');
  };

  const handleNavigation = (sectionId) => {
    if (onSectionChange && typeof onSectionChange === 'function') {
      onSectionChange(sectionId);
    } else {
      navigate('/admin', { state: { activeSection: sectionId } });
    }
  };

  // Decide logo by language
  let logo = logoSidebar;

  return (
    <header className="w-full h-12 bg-slate-800 text-white flex items-center justify-between px-4 shadow sticky top-0 z-50">
      <div className="flex items-center">
        <img
          src={logoSidebar}
          alt="Logo"
          className="h-8 w-auto mr-2 hidden sm:block rounded"
        />
        <h1 className="text-[11px] font-bold uppercase border-r border-slate-600 pr-4 hidden sm:block">
          {t("app.title")}
        </h1>
      </div>
      {/* Centered navigation bar */}
      <nav className="flex-1 flex justify-center">
        <div className="flex items-center gap-1">
        {sections.map(({ id, labelKey, icon: Icon }) => {
            const isActive = activeSection === id;

            return (
              <button
                key={id}
                onClick={() => handleNavigation(id)}
                className={`h-8 flex items-center gap-2 px-2 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon size={14} />
                <span className="hidden lg:inline">{t(labelKey)}</span>
              </button>
            );
          })}
        </div>
      </nav>
      {/* Language selector dropdown and logout button */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <button
          onClick={handleDeconnection}
          className="h-8 px-3 rounded bg-slate-700 hover:bg-slate-400 hover:text-white text-[10px] font-bold transition-all flex items-center gap-2 focus:outline-none focus:ring-2 cursor-pointer"
        >
          <IoLogOutOutline size={16} />
          <span className="hidden sm:inline">{t("logout")}</span>
        </button>
      </div>
    </header>
  );
}