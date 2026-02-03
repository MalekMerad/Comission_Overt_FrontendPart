import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Hash, Info, List, Megaphone, Users } from "lucide-react";
import DetailRow from '../components/tools/DetailRow';

import { LotsSubSection } from '../components/LotsSubSection';
import {AnnouncementSubSection} from '../components/AnnouncementSubSection';
import {SuppliersSection} from '../components/SuppliersSection';

import { getOperationByIdService } from '../services/operationService'; 

const typeBudgetMap = { 1: 'Equipement', 2: 'Fonctionnement', 3: 'Opérations Hors Budget' };
const modeAttribuationMap = { 1: "Appel d'Offres Ouvert", 2: "Appel d'Offres Restreint" };
const typeTravauxMap = { 1: 'Travaux', 2: 'Prestations', 3: 'Equipement', 4: 'Etude' };
const stateMap = { 0: 'Archivé', 1: 'Active', 2: 'En Preparation' };

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}


const sectionsHolder = [
  { 
    title: "Lots", 
    icon: <List size={14} />, 
    color: "border-blue-500",
  },
  { 
    title: "Annonces", 
    icon: <Megaphone size={14} />, 
    color: "border-amber-500",
  },
  { 
    title: "Fournisseurs", 
    icon: <Users size={14} />, 
    color: "border-emerald-500",
  }
];

const OperationDetails = () => {
  const { id } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate();
  
  const [operation, setOperation] = useState(location.state?.operation || null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const fetchOperationDetails = async (opId) => {
    setLoading(true);
    try {
      const res = await getOperationByIdService(opId);
      if (res.success) {
        setOperation(prev => ({
          ...prev,
          ...res,
          id: opId 
        }));
      } else {
        setFetchError(res.message || "Erreur lors du chargement.");
      }
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Determine the ID: Priority to URL params, then location state, then regex
    const opId = id || location.state?.operation?.id || location.pathname.match(/(\d+)$/)?.[1];

    if (!opId) {
      setFetchError("Identifiant de l'opération introuvable.");
      return;
    }

    fetchOperationDetails(opId);
  }, [id, location.pathname]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-400 text-xs italic">Chargement des détails...</p>
      </div>
    );
  }

  if (fetchError || !operation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-red-500 text-sm font-medium">{fetchError || "Aucune donnée trouvée."}</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 flex items-center gap-2 text-sm">
          <ArrowLeft size={14} /> Retourner
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-slate-800 transition-colors text-xs font-medium mb-6"
      >
        <ArrowLeft size={14} /> Retour aux opérations
      </button>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-4">
          <section className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
            <div className="border-b border-gray-300 bg-gray-100 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="text-slate-500" size={14} />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Info Opération</h2>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                operation.StateCode === 1 ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'
              }`}>
                {stateMap[operation.StateCode] || 'Inconnu'}
              </span>
            </div>
            
            <div className="p-4 bg-white">
              <DetailRow label="Numéro" value={operation.Numero || operation.NumOperation} />
              <DetailRow label="Objet" value={operation.Objet || operation.Objectif} />
              <DetailRow label="Service" value={operation.Service_Contractant || operation.ServiceDeContract} />
              <DetailRow label="Type" value={typeTravauxMap[operation.TypeTravauxCode]} />
              <DetailRow label="Budget" value={typeBudgetMap[operation.TypeBudgetCode]} />
              <DetailRow label="Attribution" value={modeAttribuationMap[operation.ModeAttributionCode]} />
              <DetailRow label="Visa N°" value={operation.NumeroVisa || operation.VisaNumber} />
              <DetailRow label="Date Visa" value={formatDate(operation.VisaDate)} />
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-200 grid grid-cols-2 gap-2">
               <button className="px-2 py-1.5 bg-white border border-gray-300 text-slate-700 rounded text-[10px] font-bold uppercase hover:bg-gray-100">
                 Modifier
               </button>
               <button className="px-2 py-1.5 bg-slate-700 text-white rounded text-[10px] font-bold uppercase hover:bg-slate-800">
                 Valider
               </button>
            </div>
          </section>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="flex-1 w-full space-y-6">
          {
          sectionsHolder.map((sec) => (
            <section key={sec.title} className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden">
              <div className="border-b border-gray-300 bg-gray-100 px-6 py-2 flex items-center gap-2">
                <div className={`w-1 h-3 ${sec.color} border-l-2`} />
                <span className="text-slate-500">{sec.icon}</span>
                <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {sec.title}
                </h2>
              </div>
              <div className="p-4">
                {operation ? sec.component : (
                  <div className="flex items-center gap-2 text-gray-400 italic text-[11px] p-6">
                    <Info size={14} />
                    Aucune donnée disponible.
                  </div>
                )}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default OperationDetails;