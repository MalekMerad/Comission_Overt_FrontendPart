import { Edit2, Trash2 } from 'lucide-react';
import { Pagination } from "../Shared/tools/Pagination"
import { useState } from "react";
import { ConfirmDeleteModal } from "../Shared/tools/DeleteConfirmation"; 

export function LotsTable({ Lots, handleOpenModal, handleDeleteLot }) {
    
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentLots = Lots.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(Lots.length / rowsPerPage);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedLot, setSelectedLot] = useState(null); // stocke tout l’objet lot

    const openDeleteModal = (lot) => {
        setSelectedLot(lot);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (selectedLot) {
            handleDeleteLot(selectedLot.id); // utilise l’ID pour la suppression
            setSelectedLot(null);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm ">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-3 py-2 text-slate-700 text-left font-bold">Numéro Lot</th>
                  <th className="px-3 py-2 text-slate-700 text-left font-bold ">Désignation</th>
                  <th className="px-3 py-2 text-slate-700 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentLots.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className=" px-4 py-8 text-center text-gray-400 text-sm"
                    >
                      Aucun lot trouvé pour cette opération
                    </td>
                  </tr>
                ) : (
                  currentLots.map((lot) => (
                    <tr key={lot.id} className="hover:bg-slate-50 transition">
                      <td className="px-3 py-2 font-semibold text-slate-800 ">{lot.NumeroLot}</td>
                      <td className="px-3 py-2 text-slate-600 ">{lot.Designation}</td>
                      <td className="px-3 py-2 ">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal(lot)}
                            className="flex items-center gap-1 px-2 py-1 rounded text-blue-700 hover:bg-blue-50 text-xs font-semibold cursor-pointer"
                            title="Modifier"
                          >
                            <Edit2 size={14} className="mr-1" />
                            <span className="text-xs hidden sm:inline">Modifier</span>
                          </button>
                          <button
                            onClick={() => openDeleteModal(lot)}
                            className="flex items-center gap-1 px-2 py-1 rounded cursor-pointer text-red-700 hover:bg-red-50 text-xs font-semibold"
                            title="Supprimer"
                          >
                            <Trash2 size={14} className="mr-1" />
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
            message={
              selectedLot
                ? `Êtes-vous sûr de vouloir supprimer le lot "${selectedLot.NumeroLot}" ?`
                : 'Êtes-vous sûr de vouloir supprimer ce lot ?'
            }
          />
        </div>
    );
}
