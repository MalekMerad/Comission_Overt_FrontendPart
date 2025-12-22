import React, { useState, useEffect } from 'react';
import { Plus, UserPlus, X, Search } from 'lucide-react';
import { LotsSubSection } from './LotsSubSection';
import { AnnouncementSubSection } from './AnnouncementSubSection';
import { useAuth } from '../context/AuthContext';
import { getOperations, newOperation, deleteoperation } from '../services/operationService';
import { getAllSuppliers, newSupplier as addNewSupplierService } from '../services/supplierService';
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

  const [searchTerm, setSearchTerm] = useState('');
  const [showOperationModal, setShowOperationModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const [showNewSupplierModal, setShowNewSupplierModal] = useState(false);
  const [selectedOperationForSupplier, setSelectedOperationForSupplier] = useState(null);
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
                    ModeAttribution: getModeAttribuationLabel(op.ModeAttribution),
                    ModeAttributionCode: op.ModeAttribution,
                    Objectif: op.Objet || '',  
                    TypeTravail: getTypeTravauxLabel(op.TypeTravaux),
                    TypeTravauxCode: op.TypeTravaux,
                    State: getStateLabel(op.State),
                    StateCode: op.State,
                    VisaNumber: op.NumeroVisa || '',
                    VisaDate: formatDate(op.DateVisa)
              }));
        
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
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette opération ?')) {
      try {
        const result = await deleteoperation(numOperation);
        if (result.success) {
          setOperations(operations.filter(op => op.NumOperation !== numOperation));
          showToast('Opération supprimée avec succès.', 'success');
        } else {
          showToast('Impossible de supprimer l\'opération.', 'error');
        }
      } catch (error) {
        showToast('Erreur lors de la suppression. Veuillez réessayer.', 'error');
      }
    }
  };
  
  const handleOpenSupplierModal = (operationId) => {
    fetchAllSupplier();
    setSelectedOperationForSupplier(operationId); 
    setShowSupplierModal(true); 
  };

  const handleAssignSupplier = async (supplierId) => {
    if (selectedOperationForSupplier) {
      try {
        setSuppliers(suppliers.map(s =>
          s.id === supplierId
            ? { ...s, operationsAssignees: [...s.operationsAssignees, selectedOperationForSupplier] }
            : s
        ));
        setShowSupplierModal(false);
        setSelectedOperationForSupplier(null);
        showToast('Fournisseur assigné avec succès.', 'success');
      } catch (error) {
        showToast('Erreur lors de l\'assignation du fournisseur.', 'error');
      }
    }
  };

  const handleAddNewSupplier = async () => {
  
    if (!newSupplier.NomSociete || !newSupplier.Nif) {
      showToast('Le nom de la société et le NIF sont obligatoires.', 'error');
      return;
    }

    try {
      const supplierData = {
        NomSociete: newSupplier.NomSociete,
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
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 flex items-center gap-2"
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded w-64"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <OperationsTable operations={filteredOperations} handleOpenSupplierModal={handleOpenSupplierModal} handleDeleteOperation={handleDeleteOperation} />
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

      {/* Supplier Selection Modal */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-white/120 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded border-2 border-gray-400 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-300 bg-gray-100 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg">Sélectionner un fournisseur</h3>
              <button
                onClick={() => {
                  setShowSupplierModal(false);
                  setSelectedOperationForSupplier(null);
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <button
                  onClick={() => setShowNewSupplierModal(true)}
                  className="px-2 py-2 bg-slate-700 text-white text-sm rounded hover:bg-slate-800 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter Nouveau Fournisseur
                </button>
              </div>

              <div
                className={`w-full ${suppliers.length > 6 ? "max-h-72 overflow-y-auto" : ""}`}
                style={{ minWidth: '100%', scrollbarWidth: 'thin' }}
              >
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Nom de la société</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Nature juridique</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Adresse</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Téléphone</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">RC</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">NIF</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                      <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((supplier) => {
                      const alreadyAssigned =
                        supplier.operationsAssignees &&
                        supplier.operationsAssignees.includes(selectedOperationForSupplier || '');
                      return (
                        <tr key={supplier.Id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">{supplier.NomSociete}</td>
                          <td className="border border-gray-300 px-4 py-2">{supplier.NatureJuridique}</td>
                          <td className="border border-gray-300 px-4 py-2">{supplier.Adresse}</td>
                          <td className="border border-gray-300 px-4 py-2">{supplier.Telephone}</td>
                          <td className="border border-gray-300 px-4 py-2">{supplier.Rc}</td>
                          <td className="border border-gray-300 px-4 py-2">{supplier.Nif}</td>
                          <td className="border border-gray-300 px-4 py-2">{supplier.Email}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            {alreadyAssigned ? (
                              <span className="text-sm text-gray-500">Déjà assigné</span>
                            ) : (
                              <button
                                onClick={() => handleAssignSupplier(supplier.Id)}
                                className="px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-800 text-sm"
                              >
                                Sélectionner
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Supplier Modal */}
      {showNewSupplierModal && (
        <div className="fixed inset-0 bg-white/120 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded border-2 border-gray-400 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-300 bg-gray-100 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg">Nouveau fournisseur</h3>
              <button
                onClick={() => setShowNewSupplierModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {/* Row 1: Raison sociale & RC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Raison sociale *</label>
                    <input
                      type="text"
                      value={newSupplier.NomSociete}
                      onChange={e => setNewSupplier({ ...newSupplier, NomSociete: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="Ex: SARL El Amine Commerce"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">RC</label>
                    <input
                      type="text"
                      value={newSupplier.Rc}
                      onChange={e => setNewSupplier({ ...newSupplier, Rc: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="Ex: 16B1234567"
                    />
                  </div>
                </div>
                {/* Row 2: Nature juridique & AI */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Nature juridique *</label>
                    <select
                      value={newSupplier.NatureJuridique}
                      onChange={e => setNewSupplier({ ...newSupplier, NatureJuridique: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                      <option value="" disabled>Sélectionner la nature juridique</option>
                      <option>SARL</option>
                      <option>EURL</option>
                      <option>SPA</option>
                      <option>SNC</option>
                      <option>Entreprise individuelle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">AI</label>
                    <input
                      type="text"
                      value={newSupplier.Ai}
                      onChange={e => setNewSupplier({ ...newSupplier, Ai: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="Ex: 12345678"
                    />
                  </div>
                </div>
                {/* Row 3: NIF & Téléphone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">NIF *</label>
                    <input
                      type="text"
                      value={newSupplier.Nif}
                      onChange={e => setNewSupplier({ ...newSupplier, Nif: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="Ex: 000616080698110"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Téléphone</label>
                    <input
                      type="text"
                      value={newSupplier.Telephone}
                      onChange={e => setNewSupplier({ ...newSupplier, Telephone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="Ex: 0661 02 03 04"
                    />
                  </div>
                </div>
                {/* Row 4: Email & Agence Bancaire */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input
                      type="email"
                      value={newSupplier.Email}
                      onChange={e => setNewSupplier({ ...newSupplier, Email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="Ex: fournisseur@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Agence Bancaire</label>
                    <input
                      type="text"
                      value={newSupplier.AgenceBancaire}
                      onChange={e => setNewSupplier({ ...newSupplier, AgenceBancaire: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="Ex: Banque Nationale, Annaba"
                    />
                  </div>
                </div>
                {/* Row 5: RIB & Adresse */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">RIB</label>
                    <input
                      type="text"
                      value={newSupplier.Rib}
                      onChange={e => setNewSupplier({ ...newSupplier, Rib: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="Ex: 001002030400500600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Adresse</label>
                    <textarea
                      value={newSupplier.Adresse}
                      onChange={e => setNewSupplier({ ...newSupplier, Adresse: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      rows={1}
                      placeholder="Ex: 10 Rue Pasteur, Annaba"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => setShowNewSupplierModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddNewSupplier}
                  className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800"
                >
                  Ajouter le fournisseur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}