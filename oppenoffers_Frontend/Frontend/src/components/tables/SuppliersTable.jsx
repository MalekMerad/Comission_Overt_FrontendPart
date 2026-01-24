import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDeleteModal } from "../tools/DeleteConfirmation";

// Fields to check for completeness
const REQUIRED_FIELDS = [
  "NomPrenom",
  "Telephone",
  "Email",
  "Adresse",
  "AgenceBancaire",
  "Ai",
  "NatureJuridique",
  "Nif",
  "NomSociete",
  "Rc",
  "Rib"
];

function isSupplierComplete(supplier) {
  return REQUIRED_FIELDS.every(
    key => supplier[key] !== null && supplier[key] !== undefined && supplier[key] !== ""
  );
}

export function SuppliersTable({ suppliers, handleModalOpen, handleDeleteSupplier }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      handleDeleteSupplier(selectedId);      
      setSelectedId(null);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteClick = (supplier) => {
    // We only need the ID for the supplier deletion service
    const supplierId = supplier.Id;

    if (!supplierId) {
      console.error('Missing ID for deletion:', supplier);
      return;
    }

    openDeleteModal(supplierId);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Nom & Prénom</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Téléphone</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Adresse</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={6} className="border border-gray-300 px-4 py-8 text-center text-gray-400 text-sm">
                  Aucun fournisseur trouvé.
                </td>
              </tr>
            ) : (
              suppliers.map((supplier, idx) => {
                const complete = isSupplierComplete(supplier);
                return (
                  <tr key={supplier.Id || idx} className="hover:bg-gray-50 transition-colors">
                    <td className="border border-gray-300 px-4 py-2 text-sm">{supplier.NomPrenom}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{supplier.Telephone}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{supplier.Email}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{supplier.Adresse}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span
                        className={
                          complete
                            ? "inline-block px-3 py-1 text-xs rounded bg-green-200 text-green-900"
                            : "inline-block px-3 py-1 text-xs rounded bg-red-200 text-red-900"
                        }
                      >
                        {complete ? "Formulaire Complet" : "Formulaire Incomplet"}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleModalOpen(supplier)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(supplier)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer le fournisseur"
        message="Êtes-vous sûr de vouloir supprimer ce fournisseur ?"
      />
    </div>
  );
}