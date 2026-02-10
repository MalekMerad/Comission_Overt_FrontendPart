import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Hash, Megaphone, Plus } from "lucide-react";
import DetailRow from '../../components/Shared/Cards/DetailRowCard';
import { DetailsCard } from '../../components/Shared/Cards/DetailsCard';

import { updateOperation } from '../../services/Operations/operationService';
import { FormModal } from '../../components/Shared/FormModal';
import { NewOperationForm } from '../../components/Operations/NewOperationForm';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';

import { fetchOperationDetails } from '../../components/Operations/FetchOperationDetails';

import { LotsSubSection } from '../../components/Lots/LotsSubSection';
import {SpecificationsSection} from '../../components/Retriat Cahier de charge/SpecificationsSection';
import { AnnouncementSubSection } from '../../components/Annonces/AnnouncementSubSection';

import { Sidebar } from '../../components/Shared/Sidebar';
import { useTranslation } from 'react-i18next';

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
  const announcementRef = useRef();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { user } = useAuth();

  // Compute opId ONCE using URL param, location state, or path, to be used everywhere
  const [opId, setOpId] = useState(() =>
    id ||
    location.state?.operation?.id ||
    location.pathname.match(/(\d+)$/)?.[1] ||
    null
  );

  const [operation, setOperation] = useState(location.state?.operation || null);

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const [lots, setLots] = useState([]);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  
  const [announces, setAnnounces] = useState([]);
  const [currentAnnounce, setCurrentAnnounce] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Add isSubmitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshOperationData = async () => {
    if (!opId) return;
  
    setLoading(true);
    try {
      const result = await fetchOperationDetails(opId);
  
      if (result.success && result.operation) {
        console.log('Fetched operation data:', result.operation);
        setOperation(result.operation);
        setLots(result.lots || []);
        setAnnounces(result.announces || []);
        setSuppliers(result.suppliers || []);
        setFetchError(null);
      } else {
        console.error('Failed to fetch operation:', result.message);
        setFetchError(result.message || 'Failed to fetch operation data');
      }
    } catch (err) {
      console.error('Error fetching operation details:', err);
      setFetchError(err?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const resolvedId = id ||
      location.state?.operation?.id ||
      location.pathname.match(/(\d+)$/)?.[1] ||
      null;
    
    if (resolvedId && resolvedId !== opId) {
      setOpId(resolvedId);
    }
    
    if (!resolvedId) {
      setFetchError(t('operationDetails.operationNotFound'));
      return;
    }
  }, [id, location.pathname, location.state?.operation?.id]);

  // Fetch data when opId changes
  useEffect(() => {
    if (opId) {
      localStorage.setItem('opId', opId);
      refreshOperationData();
    }
  }, [opId]);

  useEffect(() => {
    const found = announces.filter(ann => ann?.Status === 1);
    setCurrentAnnounce(found.length > 0 ? found[0] : null);
  }, [announces]);

  const handleOpenEditModal = () => {
    setEditFormData({
      NumOperation: operation.Numero || operation.NumOperation,
      ServContract: operation.Service_Contractant || operation.ServiceDeContract,
      Objectif: operation.Objet || operation.Objectif,
      TravalieType: operation.TypeTravauxCode ? operation.TypeTravauxCode.toString() : '',
      BudgetType: operation.TypeBudgetCode ? operation.TypeBudgetCode.toString() : '',
      MethodAttribuation: operation.ModeAttributionCode ? operation.ModeAttributionCode.toString() : '',
      VisaNum: operation.NumeroVisa || operation.VisaNumber,
      DateVisa: operation.DateVisa ? new Date(operation.DateVisa).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      adminId: user?.userId || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateOperation = async () => {
    setIsSubmitting(true);
    try {
      const formData = {
        Id: opId,
        ...editFormData,
        adminID: user?.userId
      };

      console.log('📤 Sending update data:', formData);

      const result = await updateOperation(formData);

      if (result?.success || result?.code === 0) {
        showToast(t('operations.updatedSuccess'), 'success');
        setShowEditModal(false);
        
        // Update the operation state with the new data immediately
        setOperation(prev => ({
          ...prev,
          Numero: formData.NumOperation,
          NumOperation: formData.NumOperation,
          Service_Contractant: formData.ServContract,
          ServiceDeContract: formData.ServContract,
          Objet: formData.Objectif,
          Objectif: formData.Objectif,
          TypeTravauxCode: parseInt(formData.TravalieType) || prev.TypeTravauxCode,
          TypeBudgetCode: parseInt(formData.BudgetType) || prev.TypeBudgetCode,
          ModeAttributionCode: parseInt(formData.MethodAttribuation) || prev.ModeAttributionCode,
          NumeroVisa: formData.VisaNum,
          VisaNumber: formData.VisaNum,
          DateVisa: formData.DateVisa,
          VisaDate: formData.DateVisa
        }));
        
        // Also refresh from server to get all data
        refreshOperationData();
      } else {
        showToast(result?.message || t('operations.addError'), 'error');
      }
    } catch (error) {
      console.error('Update error:', error);
      showToast(t('operations.connectionError'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // For the Add Annonce button in the header
  const handleHeaderAddClick = () => {
    if (announcementRef.current) {
      announcementRef.current.openAddModal();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-400 text-xs italic">{t('loading')}</p>
      </div>
    );
  }

  if (fetchError || !operation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-red-500 text-sm font-medium">{fetchError || t('operationDetails.noData')}</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 flex items-center gap-2 text-sm">
          <ArrowLeft size={14} /> {t('operationDetails.back')}
        </button>
      </div>
    );
  }

  return (
    <>
      <Sidebar activeSection="operations" />
      <div className="flex">
        <div className="p-8 max-w-[1600px] mx-auto flex-1">
          {/* header Operation Details */}
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mb-8">
            <div className="flex-1 min-w-0 flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div
                  className="text-slate-500 font-medium text-xs lg:text-sm whitespace-pre-line break-words max-w-[300px] leading-[1.5] tracking-[0.01em] border-l-4 border-gry-900 pl-4 bg-slate-50 mb-2"
                  title={operation.Numero || operation.NumOperation || ""}
                >
                  {t('operationDetails.operationNumber')} : {operation.Numero || operation.NumOperation}
                </div>
                <h1 className="text-[1.1rem] lg:text-[1.3rem] text-slate-800 font-semibold mb-2 tracking-wide leading-snug font-sans">
                  <span className="text-slate-400 font-normal">{t('operationDetails.object')} : </span>
                  <span className="text-slate-700 font-medium italic">
                    {operation.Objet || operation.Objectif || (
                      <span className="italic text-gray-400">{t('operationDetails.noObject')}</span>
                    )}
                  </span>
                </h1>
              </div>
              <div className="mt-3 lg:mt-0 lg:ml-6 flex-shrink-0">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold rounded-md shadow-sm transition-colors cursor-pointer"
                  onClick= {handleHeaderAddClick} 
                >
                  <span className="mr-2"><Plus size={16} /></span>
                  {t('operationDetails.addAnnouncement')}
                </button>
              </div>
            </div>        
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* LEFT SIDEBAR */}
            <aside className="w-full lg:w-80 flex-shrink-0 space-y-4">
              {/* Operation Card */}
              <DetailsCard
                leading={<div className="w-0.5 h-4 rounded-full bg-green-600" />}
                cardTitle={`Nº : ${operation.Numero || operation.NumOperation}`}
                statusCode={operation.State}
                onValidate={() => {/* TODO: handle validate operation */}}
                onModify={handleOpenEditModal}
                Icon={Hash}
                disabled={false}
              >
                <div className="p-4 bg-white">
                  <DetailRow 
                    label={t('operationDetails.service')} 
                    value={operation.Service_Contractant || operation.ServiceDeContract || 'N/A'} 
                  />
                  <DetailRow 
                    label={t('operationDetails.type')} 
                    value={typeTravauxMap[operation.TypeTravaux] || 'N/A'} 
                  />
                  <DetailRow 
                    label={t('operationDetails.budget')} 
                    value={typeBudgetMap[operation.TypeBudget] || 'N/A'} 
                  />
                  <DetailRow 
                    label={t('operationDetails.attribution')} 
                    value={modeAttribuationMap[operation.ModeAttribuation] || 'N/A'} 
                  />
                  <DetailRow 
                    label={t('operationDetails.visaNumber')} 
                    value={operation.NumeroVisa || operation.VisaNumber || 'N/A'} 
                  />
                  <DetailRow 
                    label={t('operationDetails.visaDate')} 
                    value={operation.VisaDate ? formatDate(operation.VisaDate) : (operation.DateVisa ? formatDate(operation.DateVisa) : 'N/A')} 
                  />
                </div>
              </DetailsCard>

              {/* Announce Card */}
              <DetailsCard
                leading={<div className="w-0.5 h-4 bg-orange-500 rounded-sm"/>}
                cardTitle={t('operationDetails.announcement')}
                statusCode={currentAnnounce?.Status}
                onValidate={() => alert("Validation de l'annonce non implémentée")}
                onModify={() => {
                  if (currentAnnounce && announcementRef.current) {
                    announcementRef.current.openEditModal(currentAnnounce);
                  }
                }}
                Icon={Megaphone}
                disabled={operation.Status == 1 ? true : false}
              >
                <div className="p-4 bg-white">
                {currentAnnounce ? (
                    <>
                      <DetailRow label={t('operationDetails.announcementNumber')} value={currentAnnounce.Numero || 'N/A'} />
                      <DetailRow label={t('operationDetails.journal')} value={currentAnnounce.Journal || 'N/A'} />
                      <DetailRow
                        label={t('operationDetails.publicationDate')}
                        value={currentAnnounce.Date_Publication ? formatDate(currentAnnounce.Date_Publication) : "N/A"}
                      />
                      <DetailRow
                        label={t('operationDetails.opening')}
                        value={
                          (currentAnnounce.Date_Overture ? formatDate(currentAnnounce.Date_Overture) : "") +
                          (currentAnnounce.Heure_Ouverture ? (" " + t('operationDetails.openingAt') + " " + formatTime(currentAnnounce.Heure_Ouverture)) : "")
                        }
                      />
                    </>
                  ) : (
                    <p className="text-gray-400 text-xs italic">{t('operationDetails.noAnnouncement')}</p>
                  )}  
                </div>
              </DetailsCard>
            </aside>

            {/* RIGHT CONTENT */}
            <main className="flex-1 w-full space-y-6">
              <AnnouncementSubSection 
                ref={announcementRef}
                operationID={opId}
                Annonces={announces}
                refreshData={refreshOperationData}
              />
              
              <LotsSubSection
                operationID={opId}
                Lots={lots}
                refreshData={refreshOperationData} 
              />

              <SpecificationsSection
                operationID={opId}
                Specifications={suppliers}
                refreshData={refreshOperationData} 
              />
            </main>
          </div>
          {/* Button fermer */}
          <div className="flex justify-end pt-1 px-1">
            <button
              className="flex items-center justify-center px-8 py-2 bg-white border border-gray-300 text-slate-700 rounded text-[10px] font-bold uppercase hover:bg-gray-100 min-w-[100px] cursor-pointer"
              onClick={() => navigate('/admin')}
            >
              {t('operationDetails.close')}
            </button>
          </div>
        </div>
      </div>

      <FormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleUpdateOperation}
        title={t('operations.editOperation')}
        saveText={t('edit')}
        isLoading={isSubmitting}
      >
        <NewOperationForm 
          newOperationData={editFormData} 
          setNewOperationData={setEditFormData}
          isEditing={true}
        />
      </FormModal>
    </>
  );
};

export default OperationDetails;