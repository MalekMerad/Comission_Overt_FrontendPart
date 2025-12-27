import { useState } from 'react';
import { Plus, X } from 'lucide-react';

export function CommissionSection() {
  const [members, setMembers] = useState([
    {
      id: '1',
      nom: 'Benali',
      prenom: 'Ahmed',
      fonction: 'Directeur des achats',
      role: 'Président',
      telephone: '0555 12 34 56',
    },
    {
      id: '2',
      nom: 'Khelifi',
      prenom: 'Fatima',
      fonction: 'Chef de service technique',
      role: 'Membre',
      telephone: '0555 23 45 67',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newMember, setNewMember] = useState({
    nom: '',
    prenom: '',
    fonction: '',
    role: 'Membre',
    telephone: '',
  });

  const handleAddMember = () => {
    if (newMember.nom && newMember.prenom) {
      const member = {
        id: Date.now().toString(),
        nom: newMember.nom || '',
        prenom: newMember.prenom || '',
        fonction: newMember.fonction || '',
        role: newMember.role || 'Membre',
        telephone: newMember.telephone || '',
      };
      setMembers([...members, member]);
      setNewMember({
        nom: '',
        prenom: '',
        fonction: '',
        role: 'Membre',
        telephone: '',
      });
      setShowModal(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <section className="bg-white border border-gray-300 rounded">
          <div className="border-b border-gray-300 bg-gray-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg">Commission d'ouverture des plis et d'évaluation</h2>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau membre
            </button>
          </div>
          
          <div className="p-6">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Nom</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Prénom</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Fonction</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Rôle</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Téléphone</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{member.nom}</td>
                    <td className="border border-gray-300 px-4 py-2">{member.prenom}</td>
                    <td className="border border-gray-300 px-4 py-2">{member.fonction}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        member.role === 'Président' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{member.telephone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white/120 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded border-2 border-gray-400 w-full max-w-lg">
            <div className="border-b border-gray-300 bg-gray-100 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg">Nouveau membre</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Nom *</label>
                    <input
                      type="text"
                      value={newMember.nom}
                      onChange={(e) => setNewMember({ ...newMember, nom: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Prénom *</label>
                    <input
                      type="text"
                      value={newMember.prenom}
                      onChange={(e) => setNewMember({ ...newMember, prenom: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1">Fonction</label>
                  <input
                    type="text"
                    value={newMember.fonction}
                    onChange={(e) => setNewMember({ ...newMember, fonction: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Rôle dans la commission</label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option>Président</option>
                    <option>Vice-président</option>
                    <option>Membre</option>
                    <option>Rapporteur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={newMember.telephone}
                    onChange={(e) => setNewMember({ ...newMember, telephone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    placeholder="0555 12 34 56"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddMember}
                  className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800"
                >
                  Ajouter le membre
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
