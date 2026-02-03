import { Edit2, ArchiveIcon } from 'lucide-react';
import { useState } from "react";
import { Pagination } from "../tools/Pagination"

export function AnnouncementsTable({
  announcements,
  handleOpenModal,
  handleDeleteAnnouncement,
  filterStatus = 1,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentAnnouncements = announcements.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(announcements.length / rowsPerPage);

  const isActiveView = Number(filterStatus) === 1;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto max-h-[400px]">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Numero d'annonce
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Date publication
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Journal
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Délai
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Date ouverture
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Heure d'ouverture
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Numero d'operation
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentAnnouncements.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="border border-gray-300 px-4 py-8 text-center text-gray-400 text-sm"
                >
                  Aucune annonce trouvée.
                </td>
              </tr>
            ) : (
              currentAnnouncements.map((ann) => (
                <tr key={ann.Id} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {ann.Numero}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {new Date(ann.Date_Publication).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {ann.Journal}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {ann.Delai}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {new Date(ann.Date_Overture).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-sm">
                    {ann.Heure_Ouverture || "--:--"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm">
                    {ann.Id_Operation}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="flex justify-center items-center gap-3">
                      {isActiveView ? (
                        <>
                          <button
                            onClick={() => handleOpenModal(ann)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAnnouncement(ann.Id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Archiver"
                          >
                            <ArchiveIcon className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span
                            className="inline-block text-gray-400 font-bold text-lg px-2 select-none"
                            style={{ letterSpacing: "2px" }}
                          >
                            /
                          </span>
                        </>
                      )}
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
    </div>
  );
}
