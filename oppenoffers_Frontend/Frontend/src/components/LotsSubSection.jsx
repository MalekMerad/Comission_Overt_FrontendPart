import { useState, useEffect, useRef } from 'react';
import { Plus, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllLotsService, addNewLotService, updateLotService, deleteLotService } from '../services/lotService';
import { LotsTable } from './tables/LotsTable';
import { FormModal } from './modals/FormModal';
import { NewLotForm } from './modals/NewLotForm';
import { useToast } from '../hooks/useToast';

import {SearchBar} from '../components/tools/SearchBar';
import DropDownFilter from '../components/tools/dropDownFilter'

export function LotsSubSection({ operationID}) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLot, setEditingLot] = useState(null);
  

  const [newLot, setNewLot] = useState({
    numero: '',
    designation: '',
    operationId: operationID,
  });

  // Refetch lots after add/update/delete for real-time state
  const fetchLotsRealtime = async () => {
    const currentAdmin = user?.userId || user?.userid;
    if (currentAdmin) {
      setLoading(true);
      try {
        const response = await getAllLotsService(currentAdmin,operationID);
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
  }, [operationID]);
  
  const handleOpenModal = (lot) => {
    if (lot) {
      setEditingLot(lot);
      setNewLot({
        numero: lot.NumeroLot || '',
        designation: lot.Designation || '',
        operationId: operationID || '',
      });
    } else {
      setEditingLot(null);
      setNewLot({
        numero: '',
        designation: '',
        operationId: operationID,
      });
    }
    setShowModal(true);
  };
  
  const handleModalClose = () => {
    setShowModal(false);
    setEditingLot(null);
    setNewLot({
      numero: '',
      designation: '',
      operationId: operationID,
    });
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
      id_Operation: operationID,
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
  if (!newLot.designation || !operationID) {
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


  const filteredLots = lots.filter(lot => {
    if (!lot) return false;
    const term = searchTerm.toLowerCase();
    const numeroLot = (lot.NumeroLot || '').toLowerCase();
    const designation = (lot.Designation || '').toLowerCase();
    return numeroLot.includes(term) ||
           designation.includes(term);
  });

  if (loading) {
    return <div>Chargement des lots...</div>;
  }

  return (
    <>
      <section className="bg-white border border-gray-300 rounded">
        <div className="border-b border-gray-300 bg-gray-100 px-6 py-4">
          <div className="flex justify-between row-reverse items-center">
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 flex items-center gap-2 text-sm disabled:bg-slate-400"
            >
              <Plus className="w-4 h-4" />
              Ajouter Lot
            </button>
          </div>
        </div>

        <div className="p-6">
            <LotsTable
              lots={filteredLots}
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
          operationID={operationID}
          setNewLot={setNewLot}
          editingLot={editingLot}
        />
      </FormModal>
    </>
  );
}