import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { addNewLotService, updateLotService, deleteLotService } from '../services/lotService';
import { LotsTable } from './tables/LotsTable';
import { FormModal } from './modals/FormModal';
import { NewLotForm } from './modals/NewLotForm';
import { useToast } from '../hooks/useToast';
import { SectionsModal } from '../components/modals/SectionsModal';

export function LotsSubSection({ operationID, Lots, refreshData }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLot, setEditingLot] = useState(null);

  // Run this when the Component is rendered
  useEffect(() => {
    if (Lots) {
      setLoading(false);
    }
  }, [Lots]);

  const [newLot, setNewLot] = useState({
    numero: '',
    designation: '',
    operationId: operationID,
  });

  // Reset form when operationID changes
  useEffect(() => {
    setNewLot(prev => ({
      ...prev,
      operationId: operationID,
    }));
  }, [operationID]);

  const handleOpenModal = (lot = null) => {
    console.log("Opening modal, lot parameter:", lot);
    
    if (lot) {
      // Editing an existing lot
      setEditingLot(lot);
      setNewLot({
        numero: lot.NumeroLot || '',
        designation: lot.Designation || '',
        operationId: operationID,
      });
      console.log("Setting modal for EDITING lot:", lot.NumeroLot);
    } else {
      // Adding a new lot
      setEditingLot(null);
      setNewLot({
        numero: '',
        designation: '',
        operationId: operationID,
      });
      console.log("Setting modal for ADDING new lot");
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    console.log("Closing modal");
    setShowModal(false);
    
    // Clear state after a short delay to ensure modal closes first
    setTimeout(() => {
      setEditingLot(null);
      setNewLot({
        numero: '',
        designation: '',
        operationId: operationID,
      });
    }, 100);
  };

  const handleEditLot = async () => {
    try {
      console.log("Editing lot ID:", editingLot.id, "with designation:", newLot.designation);
      const result = await updateLotService(editingLot.id, newLot.designation);

      if (result.success) {
        handleModalClose();
        showToast('Lot modifié avec succès.', 'success');
        refreshData(); // Refresh parent data
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
      
      console.log("Adding new lot:", lotData);
      const result = await addNewLotService(lotData);
      
      if (result.success) {
        handleModalClose();
        showToast('Lot ajouté avec succès.', 'success');
        refreshData();
      } else {
        showToast('Impossible d\'ajouter le lot.', 'error');
      }
    } catch (error) {
      console.error("Error adding new lot:", error);
      showToast('Erreur lors de l\'ajout du lot.', 'error');
    }
  };

  const handleSaveLot = async () => {
    console.log("Saving lot, editingLot:", editingLot);
    
    // Validation: Ensure required fields are present
    if (!newLot.designation.trim()) {
      showToast('La désignation est obligatoire.', 'error');
      return;
    }

    if (editingLot) {
      console.log("Initiating Edit for ID:", editingLot.id);
      await handleEditLot();
    } else {
      if (!newLot.numero.trim()) {
        showToast('Le numéro est obligatoire pour un nouveau lot.', 'error');
        return;
      }
      await handleAddLot();
    }
  };

  const handleDeleteLot = async (id) => {
    try {
      console.log("Deleting lot ID:", id);
      const result = await deleteLotService(id);
      
      if (result.success) {
        showToast('Lot supprimé avec succès.', 'success');
        refreshData(); // Refresh parent data
      } else {
        showToast('Impossible de supprimer le lot.', 'error');
      }
    } catch (error) {
      showToast('Erreur lors de la suppression du lot.', 'error');
    }
  };

  if (loading) {
    return <div>Chargement des Lots ...</div>;
  }

  return (
    <>
      <SectionsModal
        title="Lots"
        buttonText="Ajouter Lot"
        onButtonClick={() => {
          console.log("Add button clicked, should open empty form");
          handleOpenModal(); // Explicitly call without parameters
        }}
        showSearch={false}
        showFilter={false}
      >
        <LotsTable
          Lots={Lots}
          handleOpenModal={handleOpenModal}
          handleDeleteLot={handleDeleteLot}
        />
      </SectionsModal>

      <FormModal
        key={editingLot ? `edit-${editingLot.id}` : 'add-new'} // Force re-render with key
        isOpen={showModal}
        onClose={handleModalClose}
        onSave={handleSaveLot}
        title={editingLot ? 'Modifier le lot' : 'Nouveau Lot'}
        saveText={editingLot ? 'Modifier' : 'Ajouter'}
      >
        <NewLotForm
          newLot={newLot}
          setNewLot={setNewLot}
          editingLot={editingLot}
        />
      </FormModal>
    </>
  );
}
