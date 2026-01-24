import { useState, useEffect, useRef } from 'react';
import { Plus, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllLotsService, addNewLotService, updateLotService, deleteLotService } from '../services/lotService';
import { LotsTable } from './tables/LotsTable';
import { FormModal } from './modals/FormModal';
import { NewLotForm } from './modals/NewLotForm';
import { useToast } from '../hooks/useToast';

export function LotsSubSection({ operations , refreshTrigger, createLotTrigger, setCreateAnnounceTrigger}) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLot, setEditingLot] = useState(null);
  const isFlowActive = useRef(false);
  

  const [newLot, setNewLot] = useState({
    numero: '',
    designation: '',
    operationId: '',
  });

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    const fetchLots = async () => {
      const currentAdmin = user?.userId || user?.userid;
      if (currentAdmin) {
        setLoading(true);
        try {
          const response = await getAllLotsService(currentAdmin);
          if (mounted.current && response.success && response.data) {
            setLots(response.data);
          } else if (mounted.current && !response.success) {
            showToast('Impossible de charger la liste des lots.', 'error');
          }
        } catch (error) {
          console.error("Failed to fetch lots:", error);
          if (mounted.current) {
            showToast('Erreur de connexion au serveur.', 'error');
          }
        } finally {
          if(mounted.current)
            setLoading(false);
        }
      }
    };
    fetchLots();
    return () => { mounted.current = false; };
  }, [refreshTrigger ,user]);

  // Refetch lots after add/update/delete for real-time state
  const fetchLotsRealtime = async () => {
    const currentAdmin = user?.userId || user?.userid;
    if (currentAdmin) {
      setLoading(true);
      try {
        const response = await getAllLotsService(currentAdmin);
        if (response.success && response.data) {
          setLots(response.data);
        } else if (!response.success) {
          showToast('Impossible de charger la liste des lots.', 'error');
        }
      } catch (error) {
        console.error("Failed to fetch lots:", error);
        showToast('Erreur de connexion au serveur.', 'error');
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchLotsRealtime();
  }, [user]);
  
  const handleOpenModal = (lot) => {
    if (lot) {
      setEditingLot(lot);
      setNewLot({
        numero: lot.NumeroLot || '',
        designation: lot.Designation || '',
        operationId: lot.id_Operation || '',
      });
    } else {
      setEditingLot(null);
      setNewLot({
        numero: '',
        designation: '',
        operationId: operations && operations.length > 0 ? operations[0].id : '',
      });
    }
    setShowModal(true);
  };
  
  useEffect(() => {
    if (createLotTrigger > 0) {
      isFlowActive.current = true;
      setShowModal(true);
      setEditingLot(null); 
    }
  }, [createLotTrigger]);

  const handleModalClose = () => {
    setShowModal(false);
    setEditingLot(null);
    setNewLot({
      numero: '',
      designation: '',
      operationId: operations && operations.length > 0 ? operations[0].id : '',
    });
    // Check if the Lot was created for prev Operation and not a current one Dont show Announce 
    if(isFlowActive.current ){
      setCreateAnnounceTrigger(prev => prev + 1);
      isFlowActive.current = false;
    }
  }

const handleEditLot = async () => {
  try {
 
    const result = await updateLotService(editingLot.id, newLot.designation);

    if (result.success) {
      await fetchLotsRealtime();
      handleModalClose();
      showToast('Lot modifié avec succès.', 'success');
    } else {
      showToast('Impossible de modifier le lot.', 'error');
    }
  } catch (error) {
    showToast('Erreur lors de la modification du lot.', 'error');
  }
};


const handleAddLot = async () => {
  try {
    const lotData = {
      NumeroLot: newLot.numero,
      Designation: newLot.designation,
      id_Operation: newLot.operationId,
      adminId: user?.userId || user?.userid
    };
    
    const result = await addNewLotService(lotData);
    if (result.success) {
      await fetchLotsRealtime();
      handleModalClose();
      showToast('Lot ajouté avec succès.', 'success');
    } else {
      showToast('Impossible d\'ajouter le lot.', 'error');
    }
  } catch (error) {
    console.error("Error adding new lot:", error);
    showToast('Erreur lors de l\'ajout du lot.', 'error');
  }
};

const handleSaveLot = async () => {
  // Validation: Ensure required fields are present
  if (!newLot.designation || !newLot.operationId) {
    showToast('Veuillez remplir tous les champs obligatoires.', 'error');
    return;
  }

  if (editingLot) {
    console.log("Initiating Edit for ID:", editingLot.id);
    await handleEditLot();
  } else {
    if (!newLot.numero) {
      showToast('Le numéro est obligatoire pour un nouveau lot.', 'error');
      return;
    }
    await handleAddLot();
  }
};

  const handleDeleteLot = async (id) => {
    try {
      const result = await deleteLotService(id);
      if (result.success) {
        await fetchLotsRealtime();
        showToast('Lot supprimé avec succès.', 'success');
      } else {
        showToast('Impossible de supprimer le lot.', 'error');
      }
    } catch (error) {
      showToast('Erreur lors de la suppression du lot.', 'error');
    }
  };

  const getOperationNumero = (operationId) => {
    const operation = operations.find(op => op.id === operationId);
    return operation ? operation.NumOperation : 'N/A';
  };

  const filteredLots = lots.filter(lot => {
    if (!lot) return false;
    const term = searchTerm.toLowerCase();
    const numeroLot = (lot.NumeroLot || '').toLowerCase();
    const designation = (lot.Designation || '').toLowerCase();
    const opNumero = getOperationNumero(lot.id_Operation).toLowerCase();
    return numeroLot.includes(term) ||
           designation.includes(term) ||
           opNumero.includes(term);
  });

  if (loading) {
    return <div>Chargement des lots...</div>;
  }

  return (
    <>
      <section className="bg-white border border-gray-300 rounded">
        <div className="border-b border-gray-300 bg-gray-100 px-6 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 flex items-center gap-2 text-sm disabled:bg-slate-400"
            >
              <Plus className="w-4 h-4" />
              Ajouter Lot
            </button>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                 placeholder="N° d'lot ou N° d'operation"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-64 text-sm focus:ring-2 focus:ring-slate-200 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
            <LotsTable
              lots={filteredLots}
              getOperationNumero={getOperationNumero}
              handleOpenModal={handleOpenModal}
              handleDeleteLot={handleDeleteLot}
            />
        </div>
      </section>

      <FormModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSave={handleSaveLot}
        title={editingLot ? 'Modifier le lot' : 'Nouveau Lot'}
        saveText={editingLot ? 'Modifier' : 'Ajouter'}
      >
        <NewLotForm
          newLot={newLot}
          setNewLot={setNewLot}
          operations={operations}
          editingLot={editingLot}
        />
      </FormModal>
    </>
  );
}