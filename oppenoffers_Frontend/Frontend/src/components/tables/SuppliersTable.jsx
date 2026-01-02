import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDeleteModal } from "../tools/DeleteConfirmation"; 


export function SuppliersTable({ suppliers, handleModalOpen, handleDeleteRetrait  }) {

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState({ supplierId: null, operationId: null });

  const openDeleteModal = (supplierId, operationId) => {
    console.log('openDeleteModal called with:', supplierId, operationId);
    setSelectedIds({ supplierId, operationId });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedIds.supplierId && selectedIds.operationId) {
      handleDeleteRetrait(selectedIds.supplierId, selectedIds.operationId);      
      setSelectedIds({ supplierId: null, operationId: null });
      setShowDeleteModal(false);
    }
  };

  //verifier apres delete
  const handleDeleteClick = (supplier) => {
    const supplierId = supplier.Id;
    const operationId = supplier.OperationId;

    if (!supplierId || !operationId) {
      console.error('Missing data for deletion:', supplier);
      return;
    }

    openDeleteModal(supplierId, operationId);
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
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Opérations</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {suppliers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="border border-gray-300 px-4 py-8 text-center text-gray-400 text-sm"
                >
                  Aucun fournisseur trouvé.
                </td>
              </tr>
            ) : (
              suppliers.map((supplier, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-300 px-4 py-2 text-sm">{supplier.NomPrenom}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">{supplier.Telephone}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">{supplier.Email}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">{supplier.Adresse}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      {supplier.NumeroOperation ? supplier.NumeroOperation : "—"}
                    </div>
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
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Supprimer le retrait"
        message="Êtes-vous sûr de vouloir supprimer ce retrait ?"
      />
    </div>
  );
}
