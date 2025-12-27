import { Edit2, Trash2 } from 'lucide-react';
import { useState } from "react";
import { Pagination } from "../tools/Pagination"


export function AnnouncementsTable({ announcements, getOperationNumero, handleOpenModal, handleDeleteAnnouncement }) {
        const [currentPage, setCurrentPage] = useState(1);
        const rowsPerPage = 6;
    
        const indexOfLastRow = currentPage * rowsPerPage;
        const indexOfFirstRow = indexOfLastRow - rowsPerPage;
        const currentAnnouncements = announcements.slice(indexOfFirstRow, indexOfLastRow);
    
        const totalPages = Math.ceil(announcements.length / rowsPerPage);
    
    return (
        <div className="overflow-auto max-h-[400px]">
            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100 sticky top-0">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">Numero d'annonce</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Date publication</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Journal</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Délai</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Date ouverture</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Numero d'operation</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentAnnouncements.map(ann => (
                        <tr key={ann.Id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">{ann.Numero}</td>
                            <td className="border border-gray-300 px-4 py-2">{new Date(ann.Date_Publication).toLocaleDateString()}</td>
                            <td className="border border-gray-300 px-4 py-2">{ann.Journal}</td>
                            <td className="border border-gray-300 px-4 py-2">{ann.Delai}</td>
                            <td className="border border-gray-300 px-4 py-2">{new Date(ann.Date_Overture).toLocaleDateString()}</td>
                            <td className="border border-gray-300 px-4 py-2">{getOperationNumero(ann.Id_Operation)}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <div className="flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => handleOpenModal(ann)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Modifier"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAnnouncement(ann.Id)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
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
