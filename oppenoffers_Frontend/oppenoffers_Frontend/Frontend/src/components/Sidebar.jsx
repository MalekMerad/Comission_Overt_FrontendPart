import React from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Users, UserCheck, ClipboardList } from 'lucide-react';

export function Sidebar({ activeSection, onSectionChange }) {

    const navigate = useNavigate();
    const {logout} = useAuth();

    const handleDeconnection =  ()=>{
      localStorage.clear();
      logout();
      navigate('/');
    }

  const sections = [
    { id: 'operations', label: 'Opérations', icon: FileText },
    { id: 'suppliers', label: 'Fournisseurs', icon: Users },
    { id: 'commission', label: 'Commission', icon: UserCheck },
    { id: 'evaluation', label: 'Évaluation & Rapports', icon: ClipboardList },
  ];

  return (
    <aside className="w-64 bg-slate-800 text-white flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-lg font-[poppins]">Gestion des Appels d'Offres</h1>
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                    activeSection === section.id
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{section.label}</span>
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
