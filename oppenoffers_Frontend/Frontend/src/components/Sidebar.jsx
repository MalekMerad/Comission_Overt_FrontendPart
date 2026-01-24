import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Users, UserCheck, ClipboardList, FilesIcon, User } from 'lucide-react';

export function Sidebar({ activeSection, onSectionChange }) {

    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleDeconnection = () => {
        localStorage.clear();
        logout('/');
        navigate('/');
    }

    const sections = [
        { id: 'operations', label: 'Managment des Opérations', icon: FileText },
        { id: 'supplier', label: 'Liste des Fournisseurs', icon: User },
        { id: 'cahierDeCharge', label: 'Acquisition cahier des charges', icon: FilesIcon },
        { id: 'commission', label: 'Commission Memebers', icon: UserCheck },
        { id: 'evaluation', label: 'Évaluation & Rapports', icon: ClipboardList },
    ];

    return (
        <aside className="w-64 bg-slate-800 text-white flex flex-col">
            <div className="p-6 border-b border-slate-700">
                <h1 className="text-lg ">Gestion des Appels d'Offres</h1>
                <p className="text-xs text-slate-400 mt-1">Plateforme Administrative</p>
            </div>
            
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <li key={section.id}>
                                <button
                                    onClick={() => onSectionChange(section.id)}
                                    className={`w-full flex flex-col items-start px-2 py-2 rounded transition-colors min-h-[48px] ${
                                        activeSection === section.id
                                            ? 'bg-slate-700 text-white'
                                            : 'text-slate-300 hover:bg-slate-700/50'
                                    }`}
                                >
                                    <div className="flex flex-row items-center w-full gap-2">
                                        <Icon className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-[13px] leading-snug text-left font-medium break-words">
                                            {section.label}
                                        </span>
                                    </div>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-slate-700">
                <button
                    className="w-full flex justify-center items-center px-4 py-2 rounded bg-gray-600 text-white font-semibold hover:bg-gray-700 transition-colors shadow"
                    onClick={handleDeconnection}
                >
                    Deconnexion
                </button>
            </div>
        </aside>
    )
}
