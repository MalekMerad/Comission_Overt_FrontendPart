import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import { getAllSuppliers, newSupplier as newSupplierService, updateSupplier as updateSupplierService, deleteSupplierService } from '../services/supplierService';
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

  const handleDeleteSupplier = async (id) => {
    try {
      const result = await deleteSupplierService(id);
      if (result.success) {
        setSuppliers(prev => prev.filter(supplier => supplier.Id !== id));
        showToast(result.message || 'Fournisseur supprimé avec succès.', 'success');
      } else {
        showToast(result.message || 'Erreur lors de la suppression.', 'error');
      }
    } catch (error) {
      showToast('Erreur de connexion au serveur.', 'error');
    }
  };


  const filteredSuppliers = suppliers.filter(supplier => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const nomSociete = (supplier.NomSociete || '').toLowerCase();
    const telephone = (supplier.Telephone || '').toLowerCase();
    const email = (supplier.Email || '').toLowerCase();
    return nomSociete.includes(term) || telephone.includes(term) || email.includes(term);
  });

  const handleModalOpen = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setNewSupplier({ ...supplier });
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
                showToast(result?.message || "Erreur lors de l’ajout.", 'error');
            }
        }
    } catch (error) {
        showToast('Erreur de connexion au serveur.', 'error');
    }
  };

  if (loading) return <div className="p-8">Chargement des fournisseurs...</div>;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <section className="bg-white border border-gray-300 rounded">
          <div className="border-b border-gray-300 bg-gray-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-base font-medium">Fournisseurs</h2>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-64 text-sm focus:ring-2 focus:ring-slate-200 outline-none"
                />
              </div>
              <button 
                onClick={() => handleModalOpen()}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 flex items-center gap-2 text-sm disabled:bg-slate-400"
              >
                <Plus className="w-4 h-4" /> Ajouter Fournisseur
              </button>
            </div>
          </div>

          <div className="p-6">
            <SuppliersTable
              suppliers={filteredSuppliers}
              handleModalOpen={handleModalOpen}
              handleDeleteSupplier={handleDeleteSupplier}
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
        <NewSupplierForm newSupplier={newSupplier} setNewSupplier={setNewSupplier}/>
      </FormModal>
    </div>
  );
}