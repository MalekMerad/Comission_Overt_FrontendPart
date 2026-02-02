import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Hash, Tag, Briefcase, CreditCard, ShieldCheck } from "lucide-react";
import { SuppliersTable } from '../components/tables/SuppliersTable';
import {LotsTable} from '../components/tables/LotsTable';
import {AnnouncementsTable} from '../components/tables/AnnouncementsTable';
const typeBudgetMap = {
  1: 'Equipement',
  2: 'Fonctionnement',
  3: 'Opérations Hors Budget',
};

const modeAttribuationMap = {
  1: "Appel d'Offres Ouvert",
  2: "Appel d'Offres Restreint",
};

const typeTravauxMap = {
  1: 'Travaux',
  2: 'Prestations',
  3: 'Equipement', // Note: as per your code, index 3 is 'Equipement' for Travaux
  4: 'Etude',
};

const stateMap = {
  0: 'Archivé',
  1: 'Active',
  2: 'En Preparation',
};

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

const OperationDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get operation from state
  const operation = location.state?.operation;

  if (!operation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-gray-500">Aucune donnée trouvée pour cette opération.</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 flex items-center gap-2">
          <ArrowLeft size={16} /> Retourner au tableau
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Retour aux opérations</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="bg-gray-50 p-6 border-b border-gray-100">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Hash className="text-blue-500" size={24} />
                {operation.Numero || operation.NumOperation}
              </h1>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
              operation.State === 1 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {stateMap[operation.StateCode] || 'Statut Inconnu'}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Objective - Full Width */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
              <Tag size={14} /> Objet de l'opération
            </label>
            <div className="p-4 bg-blue-50/30 rounded-lg border border-blue-100 text-gray-700 leading-relaxed text-lg">
              {operation.Objet || operation.Objectif}
            </div>
          </div>

          {/* Service */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
              <Briefcase size={14} /> Service Contractant
            </label>
            <p className="text-gray-900 font-medium">{operation.Service_Contractant || operation.ServiceDeContract}</p>
          </div>

          {/* Type Travaux */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
              <ShieldCheck size={14} /> Type de Travaux
            </label>
            <p className="text-gray-900 font-medium">
              {typeTravauxMap[operation.TypeTravauxCode] || 'N/A'}
            </p>
          </div>

          {/* Budget */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
              <CreditCard size={14} /> Type de Budget
            </label>
            <p className="text-gray-900 font-medium">
              {typeBudgetMap[operation.TypeBudgetCode] || 'N/A'}
            </p>
          </div>

          {/* Mode Attribution */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
              <Tag size={14} /> Mode d'Attribution
            </label>
            <p className="text-gray-900 font-medium">
              {modeAttribuationMap[operation.ModeAttributionCode] || 'N/A'}
            </p>
          </div>

          {/* Visa Number */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
              <Hash size={14} /> Numéro Visa
            </label>
            <p className="text-gray-900 font-medium font-mono">
              {operation.NumeroVisa || operation.VisaNumber || 'Non spécifié'}
            </p>
          </div>

          {/* Visa Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
              <Calendar size={14} /> Date de Visa
            </label>
            <p className="text-gray-900 font-medium">{formatDate(operation.VisaDate)}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OperationDetails;