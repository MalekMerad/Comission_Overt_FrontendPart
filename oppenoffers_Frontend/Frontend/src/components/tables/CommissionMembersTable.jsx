import { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Pagination } from '../tools/Pagination';

const getRoleBadgeColor = (role) => {
  switch (role) {
    case 'Président':
      return 'bg-blue-100 text-blue-800';
    case 'Secrétaire':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function CommissionMembersTable({ members, handleOpenModal, handleDeleteMember, selectedOperationId }) {
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 10;

  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);
  
  if (selectedOperationId && members.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Aucun membre pour cette opération</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Nom complet</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Fonction</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Rôle</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                <td className="border border-gray-300 px-4 py-2 text-sm">{member.prenom} {member.nom}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm">{member.fonction}</td>
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${getRoleBadgeColor(member.role)}`}>
                    {member.role}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm">{member.email}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <div className="flex justify-center items-center gap-3">
                    <button
                      onClick={() => handleOpenModal(member)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {members.length > membersPerPage && (
        <Pagination
          itemsPerPage={membersPerPage}
          totalItems={members.length}
          paginate={setCurrentPage}
          currentPage={currentPage}
        />
      )}
    </div>
  );
}