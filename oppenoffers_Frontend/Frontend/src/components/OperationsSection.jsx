import React, { useState, useEffect } from 'react';
import { Plus, UserPlus, X, Search } from 'lucide-react';
import { LotsSubSection } from './LotsSubSection';
import { AnnouncementSubSection } from './AnnouncementSubSection';
import { useAuth } from '../context/AuthContext';
import { RetraitModal } from './detailsModal/RetraitModal';
import { SupplierModals } from "../components/detailsModal/SupplierModals";
import OperationDetails from './detailsModal/OperationDetails';
import { getOperations, newOperation, deleteoperation } from '../services/operationService';
import { getAllSuppliers, newSupplier as addNewSupplierService } from '../services/supplierService';
import { createRetrait } from '../services/retraitService';
import { OperationsTable } from './tables/OperationsTable';
import { FormModal } from './modals/FormModal';
import { NewOperationForm } from './modals/NewOperationForm';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { getBudgetTypeLabel, getModeAttribuationLabel,
  getTypeTravauxLabel, getStateLabel, formatDate } from '../utils/typeHandler';

export function OperationsSection() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const hasFetchedRef = React.useRef(false);

  const [operations, setOperations] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [showOperationModal, setShowOperationModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const [showNewSupplierModal, setShowNewSupplierModal] = useState(false);
  const [selectedOperationForSupplier, setSelectedOperationForSupplier] = useState(null);
  
  const [showOperationDetailsModal, setShowOperationDetailsModal] = useState(false);
  const [showOperationDetails, setShowOperationDetails] = useState(null);

  const [showRetraitModal, setShowRetraitModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [numeroRetrait, setNumeroRetrait] = useState('');

  
  const navigate = useNavigate();

  const [newOperationData, setNewOperationData] = useState({
    NumOperation: '',
    ServContract: '',
    Objectif: '',
    TravalieType: '',
    BudgetType: '',
    MethodAttribuation: '',
    VisaNum: '',
    DateVisa: new Date().toISOString().split('T')[0],
    adminId: user?.userId || '',
  });

  // For disabling/enabling the add operation button
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For supplier loading state
  const [supplierLoading, setSupplierLoading] = useState(false);

  const [newSupplier, setNewSupplier] = useState({
    NomSociete: '',
    NomPrenom: '',
    NatureJuridique: '',
    Adresse: '',
    Telephone: '',
    Rc: '',
    Nif: '',
    Rib: '',
    Email: '',
    Ai: '',
    AgenceBancaire: '',
    adminId: user?.userId || '',
  });

  const fetchOperations = async () => {
    try {
        setLoading(true);
        const adminID = user?.userId || user?.userid;
        
        if (!adminID) {
            showToast('Session expirée. Veuillez vous reconnecter.', 'error');
            return;
        }
        const operationsData = await getOperations(adminID);
        const mappedOperations = operationsData
            .filter(op => op.State === 1)
            .map(op => ({
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
                    StateCode: op.State,
                    VisaNumber: op.NumeroVisa || '',
                    VisaDate: formatDate(op.DateVisa)
              }));
              console.log('🔄 First mapped operation (mappedOperations[0]):', mappedOperations[0]);
              console.log('📦 All mapped operations:', mappedOperations);
        
        setOperations(mappedOperations);
        
    } catch (error) {
        console.error('❌ Error in fetchOperations:', error);
        showToast('Impossible de charger les opérations. Veuillez réessayer.', 'error');
        setOperations([]);
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
    setSupplierLoading(true);
    const adminID = user?.userId;
    if (!adminID) {
      showToast('Session expirée. Veuillez vous reconnecter.', 'error');
      return;
    }
    
    const response = await getAllSuppliers(adminID);
    console.log('Supplier data: ', response);

    if (response && response.success && Array.isArray(response.suppliers)) {
      setSuppliers(response.suppliers);
    } else {
      setSuppliers([]);
    }

  } catch (error) {
    console.error('Erreur lors du chargement des fournisseurs:', error);
    showToast('Impossible de charger la liste des fournisseurs.', 'error');
    setSuppliers([]);
  } finally {
    setSupplierLoading(false);
  }
};

useEffect(()=>{
  fetchAllSupplier()

  return()=>{};
},[user]);

const handleAddOperation = async () => {
  const formData = newOperationData;
  const requiredFields = ['NumOperation', 'ServContract', 'Objectif', 'VisaNum', 'DateVisa'];
  
  // 1. Check for empty required text fields
  const emptyFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');

  if (emptyFields.length > 0) {
      showToast('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
  }

  const currentAdminId = user?.userId || user?.userid;
  if (!currentAdminId) {
      showToast("Session expirée. Veuillez vous reconnecter.", "error");
      return;
  }

  setIsSubmitting(true);

  try {
      const payload = {
          ...formData,
          adminID: currentAdminId 
      };

      const result = await newOperation(payload);

      if (result && typeof result.code !== 'undefined') {
          switch (result.code) {
              case 0:
                  showToast('Opération ajoutée avec succès!', 'success');
                  await fetchOperations();
                  setNewOperationData({
                      NumOperation: '',
                      ServContract: '',
                      Objectif: '',
                      TravalieType: 'Travaux',
                      BudgetType: 'Equipement',
                      MethodAttribuation: "Appel d'Offres Ouvert",
                      VisaNum: '',
                      DateVisa: new Date().toISOString().split('T')[0],
                      adminID: currentAdminId,
                  });
                  setShowOperationModal(false);
                  break;
              case 1001:
                  showToast('Cette opération existe déjà.', 'warning');
                  break;
              default:
                  showToast(result.error || 'Erreur lors de l\'ajout de l\'opération.', 'error');
          }
      } else {
        showToast('Erreur lors de l\'ajout de l\'opération.', 'error');
      }
  } catch (error) {
      showToast('Erreur de connexion au serveur. Veuillez vérifier votre connexion.', 'error');
  } finally {
      setIsSubmitting(false);
  }
};


  const handleDeleteOperation = async (numOperation) => {
    try {
      const result = await deleteoperation(numOperation);
      if (result.success) {
        setOperations(prev => prev.filter(op => op.NumOperation !== numOperation));
        showToast('Opération supprimée avec succès.', 'success');
      } else {
        showToast('Impossible de supprimer l\'opération.', 'error');
      }
    } catch (error) {
      showToast('Erreur lors de la suppression. Veuillez réessayer.', 'error');
    }
  };

  const handleOpenSupplierModal = (operationId) => {
    if (!operationId) {
      showToast('ID d\'opération manquant', 'error');
      return;
    }
    
    console.log('Opening supplier modal for operation:', operationId);
    setSelectedOperationForSupplier(operationId);
    setShowSupplierModal(true);
    fetchAllSupplier(); 
  };

  const handleOpenDetailsModal = (operation) =>{
    setShowOperationDetails(operation);
    setShowOperationDetailsModal(true);
  }

  const handleAssignSupplier = async (supplierId) => {
    if (!selectedOperationForSupplier) {
      showToast('Veuillez sélectionner une opération avant d\'assigner un fournisseur', 'error');
      return;
    }
    
    setSelectedSupplier(supplierId);
    setShowRetraitModal(true);

    try {
      setSuppliers(suppliers.map(s =>
        s.id === supplierId
          ? { ...s, operationsAssignees: [...(s.operationsAssignees || []), selectedOperationForSupplier] }
          : s
      ));
      setShowSupplierModal(false);
      showToast('Fournisseur sélectionné avec succès. Veuillez saisir le numéro de retrait.', 'success');
    } catch (error) {
      showToast('Erreur lors de la sélection du fournisseur.', 'error');
    }
  };

  const handleAddNewSupplier = async () => {
  
    if (!newSupplier.NomPrenom || !newSupplier.Telephone) {
      showToast('Le nom, prénom et le téléphone sont obligatoires.', 'error');
      return;
    }


    try {
      const supplierData = {
        NomSociete: newSupplier.NomSociete,
        NomPrenom: newSupplier.NomPrenom,
        NatureJuridique: newSupplier.NatureJuridique,
        Adresse: newSupplier.Adresse,
        Telephone: newSupplier.Telephone,
        Rc: newSupplier.Rc,
        Nif: newSupplier.Nif,
        Rib: newSupplier.Rib || "non fourni",
        Email: newSupplier.Email,
        Ai: newSupplier.Ai || "non fourni",
        AgenceBancaire: newSupplier.AgenceBancaire || "non fourni",
        adminId: user?.userId || user?.userid,
      };

      const result = await addNewSupplierService(supplierData);

      if (result && result.success) {
        if (result.supplier) {
          setSuppliers(prev => [...prev, result.supplier]);
        } else {
          await fetchAllSupplier();
        }

        setShowNewSupplierModal(false);
        setShowSupplierModal(false); 
        setSelectedOperationForSupplier(null);

        setNewSupplier({
          NomSociete: '',
          NomPrenom: '',
          NatureJuridique: 'SARL',
          Adresse: '',
          Telephone: '',
          Rc: '',
          Nif: '',
          Rib: '',
          Email: '',
          Ai: '',
          AgenceBancaire: '',
          adminId: user?.userId || '',
        });

        showToast('Fournisseur ajouté avec succès.', 'success');
      } else {
        const errorCode = result?.code;
        
        switch (errorCode) {
          case 1002:
            showToast('Le Registre de Commerce (RC) est déjà utilisé.', 'warning');
            break;
          case 1003:
            showToast('Le Numéro d\'Identification Fiscale (NIF) est déjà utilisé.', 'warning');
            break;
          case 5000:
            showToast('Erreur serveur: Données trop longues ou erreur SQL.', 'error');
            break;
          default:
            showToast(result?.message || 'Une erreur est survenue lors de l\'ajout.', 'error');
        }
      }
    } catch (error) {
      console.error('[handleAddNewSupplier] Exception caught:', error);
      showToast('Erreur de connexion au serveur. Veuillez vérifier votre réseau.', 'error');
    }
  };

   const handleConfirmRetrait = async () => {
    if (!selectedOperationForSupplier) {
      showToast('Veuillez sélectionner une opération avant de confirmer le retrait', 'error');
      return;
    }
    
    if (!numeroRetrait.trim()) {
      showToast('Veuillez saisir le numéro de retrait', 'error');
      return;
    }

    const payload = {
      SupplierID: selectedSupplier,
      OperationID: selectedOperationForSupplier, 
      NumeroRetrait: numeroRetrait,
      adminId: user?.userId 
    };

    console.log('📤 Sending retrait payload:', payload);

    try {
      const result = await createRetrait(payload);

      if (result.success) {
        showToast(result.message, 'success');
        setShowRetraitModal(false);
        setNumeroRetrait('');
        setSelectedSupplier(null);
        setSelectedOperationForSupplier(null);
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      console.error('Error confirming retrait:', error);
      showToast('Erreur lors de la confirmation du retrait', 'error');
    }
  };

  const filteredOperations = operations.filter(op => {
    const numOp = op.NumOperation || '';
    const objectif = op.Objectif || '';
    const term = searchTerm.toLowerCase();
    
    return numOp.toLowerCase().includes(term) || 
           objectif.toLowerCase().includes(term);
  });

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="bg-white border border-gray-300 rounded">
          <div className="border-b border-gray-300 bg-gray-100 px-6 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowOperationModal(true)}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 flex items-center gap-2 text-sm disabled:bg-slate-400"
                disabled={isSubmitting}
              >
                <Plus className="w-4 h-4" />
                Ajouter Opération
              </button>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="N° d'operation ou objet"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded w-64 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <OperationsTable operations={filteredOperations} handleOpenSupplierModal={handleOpenSupplierModal} handleDeleteOperation={handleDeleteOperation} handleOpenDetailsModal={handleOpenDetailsModal} />
          </div>
        </section>

        <LotsSubSection operations={operations} />

        <AnnouncementSubSection operations={operations} />
      </div>

        <FormModal
            isOpen={showOperationModal}
            onClose={() => setShowOperationModal(false)}
            onSave={handleAddOperation}
            title="Nouvelle Opération"
            saveText="Ajouter l'opération"
            isLoading={isSubmitting}
        >
            <NewOperationForm newOperationData={newOperationData} setNewOperationData={setNewOperationData} />
        </FormModal>

        {showOperationDetails && (
        <FormModal
          isOpen={showOperationDetailsModal}
          onClose={() => setShowOperationDetailsModal(false)}
          title="Détails de l'opération"
          saveText="" 
        >
          <OperationDetails operation={showOperationDetails} />
        </FormModal>
      )}

       <SupplierModals
        showSupplierModal={showSupplierModal}
        setShowSupplierModal={setShowSupplierModal}
        suppliers={suppliers}
        selectedOperationForSupplier={selectedOperationForSupplier}
        handleAssignSupplier={handleAssignSupplier}
        showNewSupplierModal={showNewSupplierModal}
        setShowNewSupplierModal={setShowNewSupplierModal}
        newSupplier={newSupplier}
        setNewSupplier={setNewSupplier}
        handleAddNewSupplier={handleAddNewSupplier}
        isEditing={isEditing}
      />

      <RetraitModal
        isOpen={showRetraitModal}
        numeroRetrait={numeroRetrait}
        setNumeroRetrait={setNumeroRetrait}
        onCancel={() => {
          setShowRetraitModal(false);
          setNumeroRetrait('');
          setSelectedSupplier(null);
        }}
        onConfirm={handleConfirmRetrait}
      />

    </div>
  );
}