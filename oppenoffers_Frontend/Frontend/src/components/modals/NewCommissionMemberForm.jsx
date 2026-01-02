export function NewCommissionMemberForm({ newMember, setNewMember, operations, selectedOperationId }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Nom *</label>
          <input
            type="text"
            value={newMember.nom}
            onChange={(e) => setNewMember({ ...newMember, nom: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Ex: Benhachem"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Prénom *</label>
          <input
            type="text"
            value={newMember.prenom}
            onChange={(e) => setNewMember({ ...newMember, prenom: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Ex: Sami"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Fonction</label>
          <input
            type="text"
            value={newMember.fonction}
            onChange={(e) => setNewMember({ ...newMember, fonction: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Ex: Directeur, Ingénieur, etc."
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Rôle dans la commission</label>
          <select
            value={newMember.role}
            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="Président">Président</option>
            <option value="Secrétaire">Secrétaire</option>
            <option value="Membre">Membre</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={newMember.email}
            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Ex: member@gmail.com"
          />
        </div>
      </div>
    </div>
  );
}
