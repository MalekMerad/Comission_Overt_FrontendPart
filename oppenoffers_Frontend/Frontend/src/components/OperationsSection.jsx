import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, CheckCircle, Archive } from 'lucide-react';
import { LotsSubSection } from './LotsSubSection';
import { AnnouncementSubSection } from './AnnouncementSubSection';
import { useAuth } from '../context/AuthContext';
import { RetraitModal } from './detailsModal/RetraitModal';
import { SupplierModals } from "../components/detailsModal/SupplierModals";
import OperationDetails from './detailsModal/OperationDetails';
import { getOperations, newOperation, deleteOperationService, manageArchiveOperation } from '../services/operationService';
import { getAllSuppliers, addSelectedSupplier } from '../services/supplierService';
import { createRetrait } from '../services/retraitService';
import { OperationsTable } from './tables/OperationsTable';
import { FormModal } from './modals/FormModal';
import { NewOperationForm } from './modals/NewOperationForm';
import { useToast } from '../hooks/useToast';
import { getBudgetTypeLabel, getModeAttribuationLabel,
  getTypeTravauxLabel, getStateLabel, formatDate } from '../utils/typeHandler';

export function OperationsSection() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const hasFetchedRef = useRef(false);

  const [operations, setOperations] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For animating deleted (archived) rows
  const [deletingOp, setDeletingOp] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(1); 
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Modal States
  const [showOperationModal, setShowOperationModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showNewSupplierModal, setShowNewSupplierModal] = useState(false);
  const [selectedOperationForSupplier, setSelectedOperationForSupplier] = useState(null);
  const [showOperationDetailsModal, setShowOperationDetailsModal] = useState(false);
  const [showOperationDetails, setShowOperationDetails] = useState(null);
  const [showRetraitModal, setShowRetraitModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [numeroRetrait, setNumeroRetrait] = useState('');

  const [createLotTrigger, setCreateLotTrigger] = useState(0);
  const [createAnnounceTrigger, setCreateAnnounceTrigger] = useState(0)

  const [newOperationData, setNewOperationData] = useState({
    NumOperation: '',
    ServContract: '',
    Objectif: '',
    TravalieType: 'Travaux',
    BudgetType: 'Equipement',
    MethodAttribuation: "Appel d'Offres Ouvert",
    VisaNum: '',
    DateVisa: new Date().toISOString().split('T')[0],
    adminId: user?.userId || '',
  });

  const [newSupplier, setNewSupplier] = useState({
    NomPrenom: '',
    Adresse: '',
    Telephone: '',
    Email: '',
    adminId: user?.userId || '',
  });

  const fetchOperations = async () => {
    try {
        setLoading(true);
        const adminID = user?.userId || user?.userid;
        if (!adminID) return;

        const operationsData = await getOperations(adminID);
        const mappedOperations = operationsData.map(op => ({
            id: op.Id,
            NumOperation: op.Numero || '', 
            ServiceDeContract: op.Service_Contractant || '',
            TypeBudget: getBudgetTypeLabel(op.TypeBudget),
            TypeBudgetCode: op.TypeBudget,
            ModeAttribution: getModeAttribuationLabel(op.ModeAttribuation),
            ModeAttributionCode: op.ModeAttribuation,
            Objectif: op.Objet || '',  
            TypeTravail: getTypeTravauxLabel(op.TypeTravaux),
            TypeTravauxCode: op.TypeTravaux,
            State: getStateLabel(op.State),
            StateCode: op.State !== undefined && op.State !== null ? Number(op.State) : 1, // Ensure it's a number
            VisaNumber: op.NumeroVisa || '',
            VisaDate: formatDate(op.DateVisa)
        }));
        
        setOperations(mappedOperations);
    } catch (error) {
        showToast('Impossible de charger les opérations.', 'error');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetchedRef.current && user?.userId) {
        fetchOperations();
        hasFetchedRef.current = true;
    }
  }, [user]);

  const fetchAllSupplier = async () => {
    try {
      const adminID = user?.userId;
      if (!adminID) return;
      const response = await getAllSuppliers(adminID);
      if (response?.success && Array.isArray(response.suppliers)) {
        setSuppliers(response.suppliers);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchAllSupplier(); }, [user]);

  const handleAddOperation = async () => {
    if (!newOperationData.NumOperation || !newOperationData.Objectif) {
        showToast('Veuillez remplir les champs obligatoires.', 'error');
        return;
    }
    setIsSubmitting(true);
    try {
        const result = await newOperation({ ...newOperationData, adminID: user?.userId });
        if (result?.code === 0) {
            showToast('Opération ajoutée!', 'success');
            await fetchOperations(); // Refresh to get all operations including new one
            setNewOperationData({
              NumOperation: '',
              ServContract: '',
              Objectif: '',
              TravalieType: 'Travaux',
              BudgetType: 'Equipement',
              MethodAttribuation: "Appel d'Offres Ouvert",
              VisaNum: '',
              DateVisa: new Date().toISOString().split('T')[0],
              adminId: user?.userId || '',
            });
            setShowOperationModal(false);
           setCreateLotTrigger(prev => prev + 1);
        } else {
            showToast(result.error || 'Erreur lors de l\'ajout.', 'error');
        }
    } catch (error) {
        showToast('Erreur de connexion.', 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  const [fadeOutOps, setFadeOutOps] = useState({});

  const handleDeleteOperation = async (numOperation) => {
    setDeletingOp(numOperation);
  
    try {
      // 1. Call the API first (no UI update yet)
      const result = await deleteOperationService(numOperation);
  
      if (result.success) {
        // Only start fade-out animation if successful
        setFadeOutOps(prev => ({ ...prev, [numOperation]: true }));
        
        // Wait for fade-out animation to complete
        setTimeout(() => {
          // Update UI after animation
          setOperations(prev =>
            prev.map(op => {
              if (op.NumOperation === numOperation) {
                return {
                  ...op,
                  StateCode: 0,
                  State: getStateLabel(0),
                };
              }
              return op;
            })
          );
          
          // Clear the fade-out effect
          setFadeOutOps(prev => {
            const p = { ...prev };
            delete p[numOperation];
            return p;
          });
          setDeletingOp(null);
          
          // Show success toast
          showToast(result.message || 'Opération archivée avec succès.', 'success');
          
          // Trigger refresh if needed
          if (setRefreshTrigger) setRefreshTrigger(prev => prev + 1);
        }, 400); // Duration of fade-out animation
        
      } else {
        // Handle error - no fade-out was shown, just show error
        setDeletingOp(null);
        
        console.error("Delete handler error:", result);
        
        // Show appropriate message based on code
        if (result.code === 1000) {
          showToast("Impossible d'archiver : des fournisseurs sont déjà liés à cette opération.", 'error');
        } else {
          showToast(result.message || 'Erreur lors de l\'archivage.', 'error');
        }
      }
      
    } catch (error) {
      // Catch any unexpected errors
      setDeletingOp(null);
      
      console.error("Unexpected delete handler error:", error);
      showToast('Erreur de connexion au serveur.', 'error');
    }
  };

  const handleAddNewSupplier = async () => {
    if (!newSupplier.Email || !newSupplier.Telephone) {
      showToast('Insere Fournisseur email ou telephone.', 'error');
      return;
    }
  
    try {
      const supplierData = {
        NomPrenom: newSupplier.NomPrenom,
        Adresse: newSupplier.Adresse,
        Telephone: newSupplier.Telephone,
        Email: newSupplier.Email,
        adminId: user?.userId || user?.userid,
      };
  
      const result = await addSelectedSupplier(supplierData);
  
      if (result.success) {
        // SUCCESS LOGIC
        if (result.supplier) {
          setSuppliers(prev => [...prev, result.supplier]);
        } else {
          await fetchAllSupplier();
        }
        setShowNewSupplierModal(false);
        setNewSupplier({
          NomPrenom: '', Adresse: '', Telephone: '', Email: '', adminId: user?.userId || '',
        });
        showToast('Fournisseur ajouté avec succès.', 'success');
      } else {
        // ERROR LOGIC: Handle specific codes from api.js
        if (result.code === 1004) {
          showToast("Le numéro de téléphone est déjà utilisé.", "warning");
        } else if (result.code === 1005) {
          showToast("L'email est déjà utilisé.", "warning");
        } else {
          showToast(result.message || "Erreur lors de l'ajout.", "error");
        }
      }
    } catch (error) {
      // This catches unexpected crashes (like validation errors if you use a Yup schema)
      showToast('Une erreur inattendue est survenue.', 'error');
    }
  };

  const handleOpenSupplierModal = (operationId) => {
    setSelectedOperationForSupplier(operationId);
    setShowSupplierModal(true);
    fetchAllSupplier(); 
  };

  const handleAssignSupplier = async (supplierId) => {
    setSelectedSupplier(supplierId);
    setShowRetraitModal(true);
    setShowSupplierModal(false);
  };

  const handleUnarchiveOperation = async (operationId) => {
    try {
      // Optimistically update the UI first
      setOperations(prevOperations =>
        prevOperations.map(op =>
          op.id === operationId
            ? { ...op, StateCode: 1, State: getStateLabel(1) }
            : op
        )
      );

      const result = await manageArchiveOperation(operationId);

      if (result && result.success) {
        showToast(`${result.message}`, 'success');
      } else {
        setOperations(prevOperations =>
          prevOperations.map(op =>
            op.id === operationId
              ? { ...op, StateCode: 0, State: getStateLabel(0) }
              : op
          )
        );
        showToast(result?.message || 'Une erreur est survenue lors du désarchivage.', 'error');
      }
      await fetchOperations();
    } catch (error) {
      setOperations(prevOperations =>
        prevOperations.map(op =>
          op.id === operationId
            ? { ...op, StateCode: 0, State: getStateLabel(0) }
            : op
        )
      );
      showToast('Erreur lors du désarchivage de l’opération.', 'error');
    }
  }

  const handleConfirmRetrait = async () => {
    if (!numeroRetrait.trim()) return showToast('Numéro requis', 'error');
    try {
      const result = await createRetrait({
        SupplierID: selectedSupplier,
        OperationID: selectedOperationForSupplier, 
        NumeroRetrait: numeroRetrait,
        adminId: user?.userId 
      });
      if (result.success) {
        showToast(result.message, 'success');
        setShowRetraitModal(false);
        setNumeroRetrait('');
        // Refresh operations to update any related status
        await fetchOperations();
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) { showToast('Erreur retrait', 'error'); }
  };

  // Filter operations based on search term and status
  const filteredOperationsForTable = operations.filter(op => {
    // If fading out this entry (archived but not removed yet), do not show if in "Active" filter after marking as archived
    if (
      fadeOutOps[op.NumOperation] &&
      filterStatus === 1 // currently displaying actives
    ) {
      return false;
    }

    const term = searchTerm.toLowerCase();
    const matchesSearch = op.NumOperation?.toLowerCase().includes(term) || 
                          op.Objectif?.toLowerCase().includes(term) || 
                          op.ServiceDeContract?.toLowerCase().includes(term) || 
                          '';
    
    // Ensure we compare numbers properly
    const stateCode = Number(op.StateCode);
    const currentFilter = Number(filterStatus);
    const matchesStatus = stateCode === currentFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Only active operations (StateCode === 1) for sub-sections
  const activeOperations = operations.filter(
    op => Number(op.StateCode) === 1 && !fadeOutOps[op.NumOperation]
  );

  if (loading) return <div className="p-8">Chargement...</div>;


  const fadeOutStyle = (
    <style>
      {`
      .fade-out-row {
        opacity: 1;
        pointer-events: auto;
        transition: opacity 0.4s cubic-bezier(.4,0,.2,1);
      }
      .fade-out-row.fading {
        opacity: 0.25;
        transition: opacity 0.4s cubic-bezier(.4,0,.2,1);
        pointer-events: none;
      }
      `}
    </style>
  );

  // Custom RowClassName callback for OperationsTable (preserved react key integrity)
  const rowClassNameForOp = (op) => {
    if (fadeOutOps[op.NumOperation]) {
      return 'fade-out-row fading'; // animated out
    }
    return 'fade-out-row'; // default
  };

  return (
    <div className="p-8">
      {fadeOutStyle}
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="bg-white border border-gray-300 rounded shadow-sm">
          <div className="border-b border-gray-300 bg-gray-100 px-6 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowOperationModal(true)}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 flex items-center gap-2 text-sm disabled:bg-slate-400"
                disabled={isSubmitting}
              >
                <Plus className="w-4 h-4" /> Ajouter Opération
              </button>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-md text-xs hover:bg-gray-50 text-gray-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <Filter className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-medium tracking-tight">
                      {filterStatus === 1 ? 'Actives' : 'Archivées'}
                    </span>
                  </button>
                  {showFilterDropdown && (
                    <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden text-left text-xs">
                      <button
                        onClick={() => { 
                          setFilterStatus(1); 
                          setShowFilterDropdown(false); 
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-blue-50 focus:bg-blue-100 transition ${filterStatus === 1 ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                        style={{ fontSize: '0.83rem' }}
                      >
                        <CheckCircle className={`w-3.5 h-3.5 ${filterStatus === 1 ? 'text-blue-600' : 'text-gray-300'}`} />
                        <span className="font-medium">Actives</span>
                        <span className="ml-auto text-xs text-gray-500">
                          ({operations.filter(op => Number(op.StateCode) === 1 && !fadeOutOps[op.NumOperation]).length})
                        </span>
                      </button>
                      <button
                        onClick={() => { 
                          setFilterStatus(0); 
                          setShowFilterDropdown(false); 
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-orange-50 focus:bg-orange-100 transition ${filterStatus === 0 ? 'bg-orange-50 text-orange-700' : 'text-gray-700'}`}
                        style={{ fontSize: '0.83rem' }}
                      >
                        <Archive className={`w-3.5 h-3.5 ${filterStatus === 0 ? 'text-orange-600' : 'text-gray-300'}`} />
                        <span className="font-medium">Archivées</span>
                        <span className="ml-auto text-xs text-gray-500">
                          ({
                            operations.filter(op => Number(op.StateCode) === 0).length
                          })
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="N° d'operation ou objet"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-64 text-sm focus:ring-2 focus:ring-slate-200 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredOperationsForTable.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Archive className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">
                  {filterStatus === 1 ? 'Aucune opération active' : 'Aucune opération archivée'}
                </p>
                <p className="text-sm">
                  {filterStatus === 1 
                    ? 'Les opérations archivées seront affichées dans la vue "Archivées"'
                    : 'Les opérations actives seront affichées dans la vue "Actives"'}
                </p>
              </div>
            ) : (
              <OperationsTable 
                  operations={filteredOperationsForTable} 
                  handleOpenSupplierModal={handleOpenSupplierModal} 
                  handleDeleteOperation={handleDeleteOperation} 
                  handleOpenDetailsModal={(op) => { setShowOperationDetails(op); setShowOperationDetailsModal(true); }} 
                  filterStatus={filterStatus}
                  handleUnarchiveOperation={handleUnarchiveOperation}
                  rowClassName={rowClassNameForOp}
              />
            )}
          </div>
        </section>

        <LotsSubSection 
        operations={activeOperations} 
        refreshTrigger={refreshTrigger} 
        createLotTrigger={createLotTrigger} 
        setCreateAnnounceTrigger={setCreateAnnounceTrigger} />

        <AnnouncementSubSection 
        operations={activeOperations} 
        refreshTrigger={refreshTrigger}
        createAnnounceTrigger={createAnnounceTrigger} 
        setCreateLotTrigger={setCreateLotTrigger}
        setCreateAnnounceTrigger={setCreateAnnounceTrigger}
         />
      </div>

      <FormModal isOpen={showOperationModal} onClose={() => setShowOperationModal(false)} onSave={handleAddOperation} title="Nouvelle Opération" saveText="Ajouter l'opération" isLoading={isSubmitting}>
          <NewOperationForm newOperationData={newOperationData} setNewOperationData={setNewOperationData} />
      </FormModal>

      {showOperationDetails && (
        <FormModal isOpen={showOperationDetailsModal} onClose={() => setShowOperationDetailsModal(false)} title="Détails de l'opération" saveText="">
          <OperationDetails operation={showOperationDetails} />
        </FormModal>
      )}

      <SupplierModals
        showSupplierModal={showSupplierModal} setShowSupplierModal={setShowSupplierModal} suppliers={suppliers}
        selectedOperationForSupplier={selectedOperationForSupplier} handleAssignSupplier={handleAssignSupplier}
        showNewSupplierModal={showNewSupplierModal} setShowNewSupplierModal={setShowNewSupplierModal}
        newSupplier={newSupplier} setNewSupplier={setNewSupplier} handleAddNewSupplier={handleAddNewSupplier}
      />

      <RetraitModal
        isOpen={showRetraitModal} numeroRetrait={numeroRetrait} setNumeroRetrait={setNumeroRetrait}
        onCancel={() => setShowRetraitModal(false)} onConfirm={handleConfirmRetrait}
      />
    </div>
  );
}