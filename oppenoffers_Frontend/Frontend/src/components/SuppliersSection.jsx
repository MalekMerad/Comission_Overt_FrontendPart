import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import { getAllSuppliers, newSupplier as newSupplierService, updateSupplier as updateSupplierService, deleteSupplier as deleteSupplierService } from '../services/supplierService';
import { SuppliersTable } from './tables/SuppliersTable';
import { FormModal } from "./modals/FormModal";
import { NewSupplierForm } from "./modals/NewSupplierForm";
import { useToast } from '../hooks/useToast';

export function SuppliersSection() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [newSupplier, setNewSupplier] = useState({
    NomSociete: "",
    NatureJuridique: "SARL",
    Nif: "",
    Rc: "",
    Adresse: "",
    Telephone: "",
    Email: "",
    AgenceBancaire: "",
    Rib: "",
    Ai: "",
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      if (user?.userId) {
        setLoading(true);
        try {
          const response = await getAllSuppliers(user.userId);
          if (response.success) {
            setSuppliers(response.suppliers);
          }
        } catch (error) {
          console.error("Failed to fetch suppliers:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSuppliers();
  }, [user]);

  const handleModalOpen = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setNewSupplier({
        Id: supplier.Id,
        NomSociete: supplier.NomSociete,
        NatureJuridique: supplier.NatureJuridique,
        Nif: supplier.Nif,
        Rc: supplier.Rc,
        Adresse: supplier.Adresse,
        Telephone: supplier.Telephone,
        Email: supplier.Email,
        AgenceBancaire: supplier.AgenceBancaire,
        Rib: supplier.Rib,
        Ai: supplier.Ai,
      });
    } else {
      setEditingSupplier(null);
      setNewSupplier({
        NomSociete: "",
        NatureJuridique: "SARL",
        Nif: "",
        Rc: "",
        Adresse: "",
        Telephone: "",
        Email: "",
        AgenceBancaire: "",
        Rib: "",
        Ai: "",
      });
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingSupplier(null);
  };



const handleSaveSupplier = async () => {
  if (!newSupplier || !newSupplier.Id) return;

  try {
    const result = await updateSupplierService(newSupplier);

    if (result && (result.success === true || result.code === 0)) {
      
      setSuppliers(prevSuppliers =>
        prevSuppliers.map(s =>
          s.Id === newSupplier.Id ? { ...s, ...newSupplier } : s
        )
      );

      showToast('Fournisseur mis à jour avec succès.', 'success');
      handleModalClose();
    } else {
      console.error("Failed to update supplier", result);
      const message = result?.code === 5000 
        ? "Erreur serveur (vérifiez la longueur des champs)." 
        : "Erreur lors de la mise à jour.";
      showToast(message, 'error');
    }
  } catch (error) {
    console.error("Error in handleSaveSupplier:", error);
    showToast('Erreur de connexion au serveur.', 'error');
  }
};

  const handleDeleteSupplier = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?")) {
      const result = await deleteSupplierService(id);
      if (result.success) {
        setSuppliers(suppliers.filter(s => s.Id !== id));
      } else {
        console.error("Failed to delete supplier");
      }
    }
  };

  if (loading) {
    return <div>Chargement des fournisseurs...</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <section className="bg-white border border-gray-300 rounded">
          <div className="border-b border-gray-300 bg-gray-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg">Fournisseurs</h2>
            <button
              onClick={() => handleModalOpen()}
              className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau fournisseur
            </button>
          </div>

          <div className="p-6">
            <SuppliersTable suppliers={suppliers} handleModalOpen={handleModalOpen} handleDeleteSupplier={handleDeleteSupplier} />
          </div>
        </section>
      </div>

      <FormModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSave={handleSaveSupplier}
        title={editingSupplier ? "Modifier le fournisseur" : "Nouveau fournisseur"}
        saveText={editingSupplier ? "Modifier" : "Ajouter"}
      >
        <NewSupplierForm newSupplier={newSupplier} setNewSupplier={setNewSupplier} isEditing={editingSupplier} />
      </FormModal>
    </div>
  );
}