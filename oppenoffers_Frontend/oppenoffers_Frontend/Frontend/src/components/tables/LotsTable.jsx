import { Edit2, Trash2 } from 'lucide-react';
import { Pagination } from "../tools/Pagination"
import { useState } from "react";

export function LotsTable({ lots, getOperationNumero, handleOpenModal, handleDeleteLot }) {
    
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentLots = lots.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(lots.length / rowsPerPage);

    return (
        <div>
            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100 sticky top-0">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">Numéro</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Désignation</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Opération</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentLots.map((lot) => {
                        const lotId = lot.id; 
                        return (
                            <tr key={lotId} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{lot.NumeroLot}</td>
                                <td className="border border-gray-300 px-4 py-2">{lot.Designation}</td>
                                <td className="border border-gray-300 px-4 py-2">{getOperationNumero(lot.id_Operation)}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <div className="flex items-center justify-center gap-3">
                                        <button
                                            onClick={() => handleOpenModal(lot)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteLot(lotId)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Pagination */}
            <Pagination 
                totalPages={totalPages} 
                currentPage={currentPage} 
                handlePageChange={setCurrentPage} 
            />
        </div>
    );
}
