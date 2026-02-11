import { useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext';
import { FileText } from 'lucide-react';
import { deleteRetrait, createRetrait } from '../../services/Retrait Cahier de charge/retraitService';
import { SpecificationsTable } from './SpecificationsTable';
import { useToast } from '../../hooks/useToast';
import { SectionsModal } from "../Shared/SectionsModal";
import { SupplierModals } from '../Suppliers/SupplierModals';
import { RetraitModal } from './RetraitModal';
import { getAllSuppliers, addSelectedSupplier } from '../../services/Suppliers/supplierService';

export function SpecificationsSection({ operationID, Specifications, refreshData, showButton }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // Supplier Selection Modal
  const [showRetraitModal, setShowRetraitModal] = useState(false); // Number Input Modal
  
  // Data States
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [numeroRetrait, setNumeroRetrait] = useState("");
  
  // New Supplier Form State
  const [showNewSupplierModal, setShowNewSupplierModal] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    NomPrenom: "",
    Telephone: "",
    Email: "",
    Adresse: "",
  });


  useEffect(() => {
    async function fetchSuppliers() {
      setLoading(true);
      try {
        const data = await getAllSuppliers(user?.userId);
        if (data && data.success && Array.isArray(data.suppliers)) {
          setSuppliers(data.suppliers);
        } else {
          setSuppliers([]);
        }
      } catch (err) {
        showToast('Erreur lors du chargement des fournisseurs', 'error');
      }
      setLoading(false);
    }
    fetchSuppliers();
  }, [showModal, showNewSupplierModal, user?.userId]);


  const handleDeleteRetrait = async (supplierId) => {
    try {
      const response = await deleteRetrait(supplierId, operationID);
      if (response.success) {
        showToast(response.message || 'Retrait supprimé avec succès', 'success');
        refreshData();
      } else {
        if (response.code === 1002) {
          showToast('Aucun retrait trouvé pour cette opération et fournisseur', 'warning');
        } else {
          showToast(response.message || 'Erreur lors de la suppression', 'error');
        }
      }
    } catch (error) {
      console.error('Error in handleDeleteRetrait:', error);
      showToast('Erreur de connexion au serveur', 'error');
    }
  };


  const handleAssignSupplier = (supplierId) => {
    setSelectedSupplierId(supplierId);
    setShowModal(false); // Close selection list
    setShowRetraitModal(true); // Open number input
  };

  const handleConfirmRetrait = async () => {
    if (!numeroRetrait.trim()) {
      showToast("Le numéro de retrait est obligatoire", "warning");
      return;
    }

    try {
      const payload = {
        SupplierID: selectedSupplierId,
        OperationID: operationID,
        NumeroRetrait: numeroRetrait,
        adminId: user?.userId,
      };

      const response = await createRetrait(payload);

      if (response.success) {
        showToast(response.message, 'success');
        resetRetraitFlow();
        refreshData(); // Refresh main operation data
      } else {
        showToast(response.message, 'error');
      }
    } catch (error) {
      showToast("Une erreur est survenue lors de l'assignation", "error");
    }
  };

  const resetRetraitFlow = () => {
    setShowRetraitModal(false);
    setSelectedSupplierId(null);
    setNumeroRetrait("");
  };

  const handleAddNewSupplier = async () => {
    try {
      const response = await addSelectedSupplier({
        ...newSupplier,
        adminId: user?.userId,
      });

      if (response && response.success === true ) {
        showToast('Nouveau fournisseur ajouté avec succès', 'success');
        setShowNewSupplierModal(false);
        setNewSupplier({ NomPrenom: "", Telephone: "", Email: "", Adresse: "" });
      } else {
        showToast("Erreur lors de l'ajout du fournisseur", "error");
      }
    } catch (error) {
      showToast("Une erreur inattendue est survenue", "error");
    }
  };

  if (loading && suppliers.length === 0) {
    return <div className="p-8">Chargement des données...</div>;
  }

  return (
    <>
      <SectionsModal
        title="Retrait des Cahiers de Charges"
        icon={<FileText className="w-4 h-4" />}
        buttonText="Nouveau Retrait"
        showSearch={false}
        showFilter={false}
        onButtonClick={() => setShowModal(true)}
        showButton={showButton}
      >
        <SpecificationsTable
          specifications={Specifications || []}
          handleDeleteRetrait={handleDeleteRetrait}
          operationID={operationID}
        />
      </SectionsModal>

      <SupplierModals
        showSupplierModal={showModal}
        setShowSupplierModal={setShowModal}
        suppliers={suppliers}
        selectedOperationForSupplier={operationID}
        handleAssignSupplier={handleAssignSupplier}
        showNewSupplierModal={showNewSupplierModal}
        setShowNewSupplierModal={setShowNewSupplierModal}
        newSupplier={newSupplier}
        setNewSupplier={setNewSupplier}
        handleAddNewSupplier={handleAddNewSupplier}
      />

      <RetraitModal
        isOpen={showRetraitModal}
        numeroRetrait={numeroRetrait}
        setNumeroRetrait={setNumeroRetrait}
        onConfirm={handleConfirmRetrait}
        onCancel={resetRetraitFlow}
      />
    </>
  );
}