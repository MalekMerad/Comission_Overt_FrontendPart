import React, { useState, useRef, useEffect } from 'react';
import { FileText, UserCheck, ClipboardList, FilesIcon, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoLogOutOutline } from "react-icons/io5";
import { ChevronDown } from 'lucide-react';
import logoSidebar from '../assets/logo_sidebar.png';

// Language logos
import logo_fr from '../assets/logo_fr.png';
import logo_en from '../assets/logo_en.png';
import logo_ar from '../assets/logo_ar.png';

const sections = [
    { id: 'operations', label: 'Managment des Opérations', icon: FileText },
    { id: 'supplier', label: 'Liste des Fournisseurs', icon: User },
    { id: 'cahierDeCharge', label: 'Acquisition cahier des charges', icon: FilesIcon },
    { id: 'commission', label: 'Commission Members', icon: UserCheck },
    { id: 'evaluation', label: 'Évaluation & Rapports', icon: ClipboardList },
];

const languages = [
    { code: 'fr', label: 'FR', logo: logo_fr },
    { code: 'ar', label: 'AR', logo: logo_ar },
    { code: 'en', label: 'EN', logo: logo_en },
];

export default function Dashboard() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Language state and menu logic
    const [selectedLang, setSelectedLang] = useState(localStorage.getItem('lang') || 'fr');
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const langRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (langRef.current && !langRef.current.contains(event.target)) {
                setLangMenuOpen(false);
            }
        }
        if (langMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [langMenuOpen]);

    const handleSectionChange = (sectionId) => {
        navigate('/admin', {
            state: { activeSection: sectionId }
        });
    };

    const handleDeconnection = () => {
        localStorage.clear();
        logout();
        navigate('/');
    };

    const handleLanguageChange = (langCode) => {
        setSelectedLang(langCode);
        localStorage.setItem('lang', langCode);
        setLangMenuOpen(false);
    };

    let logo = logoSidebar;
    if (selectedLang === 'fr') logo = logo_fr;
    else if (selectedLang === 'en') logo = logo_en;
    else if (selectedLang === 'ar') logo = logo_ar;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="w-full h-12 bg-slate-800 text-white flex items-center justify-between px-4 shadow sticky top-0 z-50">
                <div className="flex items-center">
                    <img
                        src={logoSidebar}
                        alt="Logo"
                        className="h-8 w-auto mr-2 hidden sm:block rounded"
                    />
                    <h1 className="text-[11px] font-bold uppercase border-r border-slate-600 pr-4 hidden sm:block">
                        Appels d'Offres
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    {/* Language selector dropdown (copied style from Sidebar) */}
                    <div className="relative" ref={langRef}>
                        <button
                            onClick={() => setLangMenuOpen(prev => !prev)}
                            className={`flex items-center gap-0.5 px-2 h-8 rounded bg-slate-700 hover:bg-slate-600 border border-slate-600 text-[11px] font-bold outline-none transition shadow-sm
                              ${langMenuOpen ? "ring-2 ring-blue-400" : ""}
                            `}
                            style={{ minWidth: 40 }}
                        >
                            {
                                (() => {
                                    const lang = languages.find(lang => lang.code === selectedLang);
                                    if (lang && lang.logo) {
                                        return <img src={lang.logo} alt={lang.label} className="h-4 w-4 mr-1 rounded-full inline-block" />;
                                    }
                                    return null;
                                })()
                            }
                            {languages.find(lang => lang.code === selectedLang)?.label || 'FR'}
                            <ChevronDown size={13} className={`transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {langMenuOpen && (
                            <div className="absolute left-0 mt-1 w-24 bg-white text-slate-800 rounded shadow-lg border border-slate-200 z-50 animate-fade-in">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang.code)}
                                        className={`w-full px-3 py-2 text-left text-sm font-medium rounded-none hover:bg-blue-100 transition-colors flex items-center ${
                                            selectedLang === lang.code ? 'bg-blue-100 text-blue-700' : ''
                                        }`}
                                    >
                                        {lang.logo && (
                                            <img src={lang.logo} alt={lang.label} className="h-4 w-4 mr-2 rounded-full inline-block" />
                                        )}
                                        <span>{lang.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleDeconnection}
                        className="h-8 px-3 rounded bg-slate-700 hover:bg-slate-400 hover:text-white text-[10px] font-bold transition-all flex items-center gap-2 focus:outline-none focus:ring-2 cursor-pointer"
                    >
                        <IoLogOutOutline size={16} />
                        <span className="hidden sm:inline">Déconnexion</span>
                    </button>
                </div>
            </header>

            <main className="flex flex-1 justify-center items-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <div
                                key={section.id}
                                onClick={() => handleSectionChange(section.id)}
                                className="bg-white rounded-xl shadow p-5 w-60 h-44
                                           flex flex-col items-center justify-center
                                           cursor-pointer border-2 border-slate-200
                                           hover:border-blue-400 transition"
                                style={{ cursor: "pointer" }}
                            >
                                <div className="bg-blue-100 rounded-full p-3 mb-3 flex items-center justify-center">
                                    <Icon className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-center font-semibold text-gray-800 text-sm">
                                    {section.label}
                                </h3>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
