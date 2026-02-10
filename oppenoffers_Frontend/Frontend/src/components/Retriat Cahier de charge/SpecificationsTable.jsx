import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ConfirmDeleteModal } from "../Shared/tools/DeleteConfirmation";

export function SpecificationsTable({ specifications, handleDeleteRetrait }) {
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

  useEffect(()=>{
    console.log("SpecificationsTable : ", specifications);
  },[])

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2 text-slate-700 text-left font-bold border-b border-gray-200">Numéro de retrait</th>
              <th className="px-3 py-2 text-slate-700 text-left font-bold border-b border-gray-200">Nom & Prénom</th>
              <th className="px-3 py-2 text-slate-700 text-left font-bold border-b border-gray-200">Contact</th>
              <th className="px-3 py-2 text-slate-700 text-left font-bold border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {safeSpecifications.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="border border-gray-300 px-4 py-8 text-center text-gray-400 text-sm"
                >
                  Aucune Acquisition de cahier de charge trouvée.
                </td>
              </tr>
            ) : (
              safeSpecifications.map((specification, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="px-3 py-2 font-semibold text-slate-800 border-b border-gray-100">{specification.NumeroRetrait}</td>
                  <td className="px-3 py-2 font-semibold text-slate-800 border-b border-gray-100">{specification.NomPrenom}</td>
                  <td className="px-3 py-2 font-semibold text-slate-800 border-b border-gray-100">
                    {specification.Telephone && specification.Telephone.trim().length > 0
                      ? specification.Telephone
                      : (specification.Email && specification.Email.trim().length > 0
                        ? specification.Email
                        : '/')}
                  </td>
                  <td className="px-3 py-2 font-semibold text-slate-800 border-b border-gray-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteClick(specification)}
                        className="flex items-center gap-1 px-2 py-1 rounded text-red-700 hover:bg-red-50 text-xs font-semibold"
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
