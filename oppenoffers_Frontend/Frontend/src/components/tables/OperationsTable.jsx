import { useState } from "react";
import { Trash2, UserPlus, FileSearch, ArchiveIcon, ArchiveRestore } from "lucide-react";
import { Pagination } from "../tools/Pagination";
import { ConfirmDeleteModal } from "../tools/DeleteConfirmation"; 

export function OperationsTable({ operations, handleOpenSupplierModal, handleDeleteOperation, handleOpenDetailsModal, filterStatus = 1, handleUnarchiveOperation}) {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentOperations = operations.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(operations.length / rowsPerPage);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedOperationNum, setSelectedOperationNum] = useState(null);

    const openDeleteModal = (numOperation) => {
        setSelectedOperationNum(numOperation);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (selectedOperationNum !== null) {
            handleDeleteOperation(selectedOperationNum);
            setSelectedOperationNum(null);
            setShowDeleteModal(false);
        }
    };
    
    const getOperationId = (operation) => {
        return operation.Id || operation.id || operation.NumOperation;
    };

    const isActiveView = Number(filterStatus) === 1;

    // Set appropriate modal text based on filterStatus
    const deleteModalTitle = isActiveView ? "Archiver l'opération" : "Restaurer l'opération";
    const deleteModalMessage = isActiveView 
        ? "Êtes-vous sûr de vouloir archiver cette opération ?" 
        : "Êtes-vous sûr de vouloir restaurer cette opération ?";

    return (
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Numéro</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Service</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Objet</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Statut</th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentOperations.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="border border-gray-300 px-4 py-8 text-center text-gray-400 text-sm"
                  >
                    {isActiveView ? "Aucune opération active trouvée." : "Aucune opération archivée trouvée."}
                  </td>
                </tr>
              ) : (
                currentOperations.map((op) => (
                  <tr key={op.NumOperation} className="hover:bg-gray-50 transition-colors">
                    <td className="border border-gray-300 px-4 py-2 text-sm">{op.NumOperation}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{op.ServiceDeContract}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">{op.Objectif}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        op.StateCode === 1 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {op.State}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleOpenDetailsModal(op)}
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                          title="Voir détails"
                        >
                          <FileSearch className="w-4 h-4" />
                        </button>
                        {isActiveView ? (
                          <>
                            <button
                              onClick={() => handleOpenSupplierModal(getOperationId(op))}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Sélectionner un fournisseur"
                            >
                              <UserPlus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(op.NumOperation)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Archiver l'opération"
                            >
                              <ArchiveIcon className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleUnarchiveOperation(op.id)}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title="Restaurer l'opération depuis les archives"
                          >
                            <ArchiveRestore className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {operations.length > rowsPerPage && (
          <Pagination
            itemsPerPage={rowsPerPage}
            totalItems={operations.length}
            paginate={setCurrentPage}
            currentPage={currentPage}
          />
        )}

        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title={deleteModalTitle}
          message={deleteModalMessage}
          ButtonContext={'Archive'}
        />
      </div>
    );
}