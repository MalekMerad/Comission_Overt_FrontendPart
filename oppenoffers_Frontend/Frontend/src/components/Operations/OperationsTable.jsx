import { useState } from "react";
import { Trash2, UserPlus, FileSearch, ArchiveIcon, ArchiveRestore } from "lucide-react";
import { Pagination } from "../Shared/tools/Pagination";
import { ConfirmDeleteModal } from "../Shared/tools/DeleteConfirmation"; 
import { useTranslation } from "react-i18next";

export function OperationsTable({ operations, handleOpenSupplierModal, handleDeleteOperation, handleOpenDetailsModal, filterStatus = 1, handleUnarchiveOperation}) {
    const { t, i18n } = useTranslation();  
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
    const deleteModalTitle = isActiveView ?  t('operations.archiveOperation') : t('operations.restoreOperation');
    const deleteModalMessage = isActiveView 
        ? t('operations.archiveConfirmMessage')
        : t('operations.restoreConfirmMessage');

    const isRTL = i18n.language === "ar";

    return (
      <div className={`space-y-4 ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <tbody className="bg-white">
              {currentOperations.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-8 text-center text-gray-400 text-sm"
                  >
                    {isActiveView ? t('operations.noActiveOperations') : t('operations.noArchivedOperations')}
                  </td>
                </tr>
              ) : (
                currentOperations.map((op) => (
                  <tr key={op.NumOperation} className="hover:bg-gray-100 transition-colors">
                    <td className="px-4 py-2 text-sm" colSpan={2}>
                      <div
                        className="font-semibold flex items-center flex-wrap cursor-pointer "
                        onClick={() => handleOpenDetailsModal(op)}
                        title={t('operations.viewDetails')}
                        style={{ userSelect: 'none' }}
                      >
                        <span className="text-slate-600">
                          {t('operations.operation')} <span className="font-bold">Nº {op.NumOperation}</span> :
                        </span>
                        <span className="mx-2 text-gray-500 font-normal text-sm">{op.Objectif}</span>
                        {op.ServiceDeContract && (
                          <span className="ml-2 text-gray-400 font-light text-xs">({op.ServiceDeContract})</span>
                        )}
                      </div>
                      <div className="pl-42">
                        
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center align-top">
                      <div className="flex justify-center items-start gap-3 mt-2">
                        {isActiveView ? (
                          <>
                            <button
                              onClick={() => openDeleteModal(op.NumOperation)}
                              className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                              title={t('operations.archiveOperation')}
                            >
                              <ArchiveIcon className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleUnarchiveOperation(op.id)}
                            className="text-green-600 hover:text-green-800 transition-colors cursor-pointer"
                            title={t('operations.restoreOperation')}
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
            totalPages={totalPages}
            totalItems={operations.length}
            handlePageChange={setCurrentPage}
            currentPage={currentPage}
          />
        )}

        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title={deleteModalTitle}
          message={deleteModalMessage}
          ButtonContext={t('operations.archive')}
        />
      </div>
    );
}