import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import { getAllSuppliers, newSupplier as newSupplierService, updateSupplier as updateSupplierService, deleteSupplier as deleteSupplierService } from '../services/supplierService';
import { getSuppliersWithOperations, deleteRetrait  } from '../services/retraitService';
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
    NomPrenom: "",
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      if (user?.userId) {
        setLoading(true);
        try {
          const response = await getSuppliersWithOperations(user.userId);

          if (response.success) {
            setSuppliers(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch suppliers with operations:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSuppliers();
  }, [user]);


  // Filter suppliers by Raison sociale (NomSociete), phone (Telephone), or journal (Email)
  const filteredSuppliers = suppliers.filter(supplier => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const nomSociete = (supplier.NomSociete || '').toLowerCase();
    const telephone = (supplier.Telephone || '').toLowerCase();
    const journal = (supplier.Email || '').toLowerCase(); // Assuming journal means Email
    return nomSociete.includes(term) || telephone.includes(term) || journal.includes(term);
  });

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
        NomPrenom: supplier.NomPrenom,
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
        NomPrenom: "",
      });
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingSupplier(null);
  };

  const handleSaveSupplier = async () => {
    try {
        if (editingSupplier) {
            const result = await updateSupplierService(newSupplier, showToast);

            if (result.code === 0) {
                setSuppliers(prev =>
                    prev.map(s => (s.Id === newSupplier.Id ? { ...s, ...newSupplier } : s))
                );
                handleModalClose();
            }
        } else {
            const result = await newSupplierService({ ...newSupplier, adminId: user.userId });
            if (result.success) {
                setSuppliers(prev => [...prev, result.supplier]);
                showToast('Fournisseur ajouté avec succès.', 'success');
                handleModalClose();
            } else {
                const message = result?.message || "Erreur lors de l’ajout du fournisseur.";
                showToast(message, 'error');
            }
        }

    } catch (error) {
        console.error("Error in handleSaveSupplier:", error);
        showToast('Erreur de connexion au serveur.', 'error');
    }
};

  const handleDeleteRetrait = async (supplierId, operationId) => {
    try {
      console.log('Deleting retrait:', { supplierId, operationId });
      
      const response = await deleteRetrait(supplierId, operationId);
      
      console.log('Delete response:', response);

      if (response.success) {
        setSuppliers(prev => prev.filter( s => !(s.Id === supplierId && s.OperationId === operationId)
      ));
       
        showToast(response.message || 'Retrait supprimé avec succès', 'success');
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

  if (loading) {
    return <div>Chargement des fournisseurs...</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <section className="bg-white border border-gray-300 rounded">
          <div className="border-b border-gray-300 bg-gray-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-base">Fournisseurs</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Téléphone, journal ou Raison sociale"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded w-64 text-sm"
              />
            </div>
          </div>

          <div className="p-6">
            <SuppliersTable
              suppliers={filteredSuppliers}
              handleModalOpen={handleModalOpen}
              handleDeleteRetrait={handleDeleteRetrait}
            />
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