import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Hash, Info } from "lucide-react";
import DetailRow from '../components/tools/DetailRow';
import { DetailsCard } from '../components/tools/DetailsCard';

import { fetchOperationDetails } from '../components/tools/FetchOperationDetails';

import { LotsSubSection } from '../components/LotsSubSection';
import {SpecificationsSection} from '../components/SpecificationsSection';

const typeBudgetMap = { 1: 'Equipement', 2: 'Fonctionnement', 3: 'Opérations Hors Budget' };
const modeAttribuationMap = {
  1: "Appel d'Offres Ouvert",
  2: "Appel d'Offres Restreint",
};
const typeTravauxMap = { 1: 'Travaux', 2: 'Prestations', 3: 'Equipement', 4: 'Etude' };

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(timeString) {
  if (!timeString) return '';
  return new Date(timeString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const OperationDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Compute opId ONCE using URL param, location state, or path, to be used everywhere
  const [opId, setOpId] = useState(() =>
    id ||
    location.state?.operation?.id ||
    location.pathname.match(/(\d+)$/)?.[1] ||
    null
  );

  const [operation, setOperation] = useState(location.state?.operation || null);

  useEffect(()=>{
    console.log('In operationDetails.jsx',operation)
  },[])

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const [lots, setLots] = useState([]);
  const [announces, setAnnounces] = useState([]);
  const [currentAnnounce, setCurrentAnnounce] = useState([]);
  const [cahierDeCharges, setCahierDeCharges] = useState([]);

  const refreshOperationData = async () => {
    if (!opId) return;
    
    setLoading(true);
    try {
      const result = await fetchOperationDetails(opId);
      
      if (result.success) {
        setLots(result.lots || []);
        setAnnounces(result.announces || []);
        setCahierDeCharges(result.cahierDeCharges || []);
        setFetchError(null);
      } else {
        setFetchError(result.message);
      }
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Update the existing useEffect to use the new function
  useEffect(() => {
    if (!opId) {
      const resolvedId =
        id ||
        location.state?.operation?.id ||
        location.pathname.match(/(\d+)$/)?.[1] ||
        null;
      setOpId(resolvedId);
      if (!resolvedId) {
        setFetchError("Identifiant de l'opération introuvable.");
        return;
      }
      localStorage.setItem('opId', resolvedId);
      refreshOperationData();
      return;
    }
  
    setFetchError(null);
    localStorage.setItem('opId', opId);
    refreshOperationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opId, id, location.pathname]);
  // Put in currentAnnounce the only announce with State 1
  useEffect(() => {
    const found = announces.filter(ann => ann?.Status === 1);
    setCurrentAnnounce(found.length > 0 ? found[0] : null);
  }, [announces]);


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
          {/* Operation Card */}
          <DetailsCard
            cardTitle="Info Opération"
            statusCode={operation.StateCode}
            onValidate={() => {/* TODO: handle validate operation */}}
            onModify={() => {/* TODO: handle modify operation */}}
            Icon={Hash}
            disabled={false}
          >
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
          </DetailsCard>

          {/* Announce Card */}
          <DetailsCard
            cardTitle="Annonce"
            statusCode={currentAnnounce?.Status}
            onValidate={() => alert("Validation de l'annonce non implémentée")}
            onModify={() => {/* TODO: handle modify announce */}}
            Icon={Info}
            disabled={operation.Status == 1 ? true : false}
          >
            <div className="p-4 bg-white">
            {currentAnnounce ? (
                <>
                      <DetailRow label="Numéro annonce" value={currentAnnounce.Numero} />
                      <DetailRow label="Journal" value={currentAnnounce.Journal} />
                      <DetailRow
                          label="Date publication"
                          value={currentAnnounce.Date_Publication ? formatDate(currentAnnounce.Date_Publication) : "N/A"}
                      />
                      <DetailRow
                      label="Ouverture"
                      value={
                        (currentAnnounce.Date_Overture ? formatDate(currentAnnounce.Date_Overture) : "") +
                        (currentAnnounce.Heure_Ouverture ? (" à " + formatTime(currentAnnounce.Heure_Ouverture)) : "")
                      }
                    />
                  </>
              ) : (
                 <p className="text-gray-400 text-xs italic">Aucune annonce active trouvée.</p>
              )}  
            </div>
          </DetailsCard>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="flex-1 w-full space-y-6">
          <LotsSubSection
            operationID={opId}
            Lots={lots}
            refreshData={refreshOperationData} 
          />

          <SpecificationsSection
            operationID={opId}
            Specifications={cahierDeCharges}
            refreshData={refreshOperationData} 
          />
        </main>
      </div>
    </div>
  );
};

export default OperationDetails;