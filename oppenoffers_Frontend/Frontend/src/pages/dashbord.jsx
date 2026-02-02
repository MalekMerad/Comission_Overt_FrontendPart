import React from 'react';
import { FileText, UserCheck, ClipboardList, FilesIcon, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IoLogOutOutline } from "react-icons/io5";

const sections = [
    { id: 'operations', label: 'Managment des Opérations', icon: FileText },
    { id: 'supplier', label: 'Liste des Fournisseurs', icon: User },
    { id: 'cahierDeCharge', label: 'Acquisition cahier des charges', icon: FilesIcon },
    { id: 'commission', label: 'Commission Members', icon: UserCheck },
    { id: 'evaluation', label: 'Évaluation & Rapports', icon: ClipboardList },
];

export default function Dashboard() {
    const navigate = useNavigate();

    const handleSectionChange = (sectionId) => {
        navigate('/admin', {
            state: { activeSection: sectionId }
          });
          
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="w-full bg-slate-800 shadow flex items-center justify-between py-3 px-6">
                <div>
                    <span className="text-base font-bold text-white">
                        Gestion des Appels d'Offres
                    </span>
                    <div className="text-xs text-blue-100">
                        Plateforme Administrative
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="bg-gray-600 px-3 py-1 rounded-md text-white hover:bg-gray-700 flex items-center gap-2"
                >
                    <IoLogOutOutline className="w-4 h-4" />
                    Déconnexion
                </button>
            </header>

            <main className="flex flex-1 justify-center items-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <div
                                key={section.id}
                                onClick={() => handleSectionChange(section.id)}
                                className="bg-white rounded-lg shadow p-4 w-56 h-40
                                           flex flex-col items-center justify-center
                                           cursor-pointer border-2
                                           hover:border-blue-400 transition"
                            >
                                <div className="bg-blue-100 rounded-full p-3 mb-3">
                                    <Icon className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-center font-semibold text-gray-800">
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
