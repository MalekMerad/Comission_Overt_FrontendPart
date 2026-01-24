import { Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDeleteModal } from "../tools/DeleteConfirmation";

export function SpecificationsTable({ specifications, handleDeleteRetrait }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState({ supplierId: null, operationId: null });

  const safeSpecifications = Array.isArray(specifications) ? specifications : [];

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

  const handleDeleteClick = (specification) => {
    const supplierId = specification.Id;
    const operationId = specification.OperationId;

    if (!supplierId || !operationId) {
      console.error('Missing data for deletion:', specification);
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
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Contact</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Nombre d'Opération</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Service d'Opération</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Objet d'Opération</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {safeSpecifications.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="border border-gray-300 px-4 py-8 text-center text-gray-400 text-sm"
                >
                  Aucun cahier de charge trouvé.
                </td>
              </tr>
            ) : (
              safeSpecifications.map((specification, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-300 px-4 py-2 text-sm">{specification.NomPrenom}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {specification.Telephone && specification.Telephone.trim().length > 0
                      ? specification.Telephone
                      : (specification.Email && specification.Email.trim().length > 0
                        ? specification.Email
                        : '/')}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">{specification.NumeroOperation}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">{specification.ServiceOperation}</td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">{specification.ObjectOperation}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => handleDeleteClick(specification)}
                        className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1 px-2 py-1 rounded text-sm transition-colors mx-auto"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span className="text-sm">Supprime</span>
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
