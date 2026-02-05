import { Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDeleteModal } from "../tools/DeleteConfirmation";

export function SpecificationsTable({ specifications, handleDeleteRetrait, OperationId }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null); // Only need supplier ID now

  const safeSpecifications = Array.isArray(specifications) ? specifications : [];

  const openDeleteModal = (supplierId) => {
    setSelectedSupplierId(supplierId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSupplierId) {
      // Only pass supplier ID, OperationId is already known in the parent component
      handleDeleteRetrait(selectedSupplierId);
      setSelectedSupplierId(null);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteClick = (specification) => {
    const supplierId = specification.Id; // Get supplier ID from the row

    if (!supplierId) {
      console.error('Missing supplier ID for deletion:', specification);
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
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 bg-white">Numéro de retrait</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 bg-white">Nom & Prénom</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700 bg-white">Contact</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700 bg-white">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {safeSpecifications.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="border border-gray-300 px-4 py-8 text-center text-gray-400 text-sm"
                >
                  Aucun cahier de charge trouvé.
                </td>
              </tr>
            ) : (
              safeSpecifications.map((specification, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-300 px-4 py-2 text-sm">{specification.NumeroRetrait}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">{specification.NomPrenom}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {specification.Telephone && specification.Telephone.trim().length > 0
                      ? specification.Telephone
                      : (specification.Email && specification.Email.trim().length > 0
                        ? specification.Email
                        : '/')}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="flex justify-around items-center">
                      <button
                        onClick={() => handleDeleteClick(specification)}
                        className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-xs hidden sm:inline">Supprimer</span>
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
        ButtonContext={'Supprimer'}
      />
    </div>
  );
}
