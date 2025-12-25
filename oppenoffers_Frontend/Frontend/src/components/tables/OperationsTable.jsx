import { Trash2, UserPlus, FileSearch } from 'lucide-react';

export function OperationsTable({ operations, handleOpenSupplierModal, handleDeleteOperation, handleOpenDetailsModal }) {
    return (
        <div className={operations.length > 6 ? "overflow-y-scroll max-h-[432px]" : "overflow-y-visible"}>
            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100 sticky top-0">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">Numéro</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Service</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Objet</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Statut</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {operations.map((op, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">{op.NumOperation}</td>
                            <td className="border border-gray-300 px-4 py-2">{op.ServiceDeContract}</td>
                            <td className="border border-gray-300 px-4 py-2">{op.Objectif}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                                    {op.State}
                                </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <div className="flex items-center justify-center gap-3">

                                      <button
                                        onClick={() => handleOpenDetailsModal(op)}
                                        className="text-gray-600 hover:text-gray-800"
                                        title="Voir détails"
                                    >
                                        <FileSearch  className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={() => handleOpenSupplierModal(op.Id)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Ajouter fournisseur"
                                    >
                                        <UserPlus className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={() => handleDeleteOperation(op.NumOperation)}
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
        </div>
    );
}
