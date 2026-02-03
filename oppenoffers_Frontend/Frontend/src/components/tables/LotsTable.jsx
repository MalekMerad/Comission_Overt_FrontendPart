import { Edit2, Trash2 } from 'lucide-react';
import { Pagination } from "../tools/Pagination"
import { useState } from "react";
import { ConfirmDeleteModal } from "../tools/DeleteConfirmation"; 


export function LotsTable({ lots, handleOpenModal, handleDeleteLot }) {
    
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentLots = lots.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(lots.length / rowsPerPage);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedLotId, setSelectedLotId] = useState(null);


        const openDeleteModal = (id) => {
            setSelectedLotId(id);
            setShowDeleteModal(true);
        };

        const handleConfirmDelete = () => {
            if (selectedLotId !== null) {
                handleDeleteLot(selectedLotId);
                setSelectedLotId(null);
                setShowDeleteModal(false);
            }
        };
    

    return (
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Numéro</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Désignation</th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentLots.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="border border-gray-300 px-4 py-8 text-center text-gray-400 text-sm"
                  >
                    Aucun lot trouvé.
                  </td>
                </tr>
              ) : (
                currentLots.map((lot) => {
                  const lotId = lot.id;
                  return (
                    <tr key={lotId} className="hover:bg-gray-50 transition-colors">
                      <td className="border border-gray-300 px-4 py-2 text-sm">{lot.NumeroLot}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">{lot.Designation}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <div className="flex justify-around items-center gap-3">
                          <button
                            onClick={() => handleOpenModal(lot)}
                            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                            <span className="text-xs hidden sm:inline">Modifier</span>
                          </button>
                          <button
                            onClick={() => openDeleteModal(lotId)}
                            className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-xs hidden sm:inline">Supprimer</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={setCurrentPage}
        />
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title="Supprimer lot"
          message="Êtes-vous sûr de vouloir supprimer cette lot ?"
        />
      </div>
    );
}
