import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoLogOutOutline } from "react-icons/io5";
import {
  FileText,
  User,
  UserCheck,
  ClipboardList,
  FilesIcon
} from 'lucide-react';

export function Sidebar({ activeSection, onSectionChange }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleDeconnection = () => {
    localStorage.clear();
    logout('/');
    navigate('/');
  };

  const sections = [
    { id: 'operations', label: 'Managment des Opérations', icon: FileText },
    { id: 'supplier', label: 'Liste des Fournisseurs', icon: User },
    { id: 'cahierDeCharge', label: 'Acquisition cahier des charges', icon: FilesIcon },
    { id: 'commission', label: 'Commission Members', icon: UserCheck },
    { id: 'evaluation', label: 'Évaluation & Rapports', icon: ClipboardList },
  ];

  return (
    <header className="w-full h-12 bg-slate-800 text-white flex items-center justify-between px-2 shadow">
      
      {/* Title */}
      <div className="leading-tight">
        <h1 className="text-[11px] font-semibold leading-none">
          Gestion des Appels d'Offres
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-1 h-full">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`h-8 flex items-center gap-1 px-2 rounded text-[10px] font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-700/60'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span className="whitespace-nowrap">{section.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleDeconnection}
        className="h-8 px-2 rounded bg-gray-600 text-[10px] font-semibold hover:bg-gray-700 transition-colors flex items-center gap-1"
      >
        <IoLogOutOutline className="w-4 h-4" />
        Déconnexion
      </button>
    </header>
  );
}
