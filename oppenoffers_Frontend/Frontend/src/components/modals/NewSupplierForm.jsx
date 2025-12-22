export function NewSupplierForm({ newSupplier, setNewSupplier, isEditing }) {

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm mb-1">Raison sociale *</label>
                    <input
                        type="text"
                        value={newSupplier.NomSociete}
                        onChange={(e) => setNewSupplier({ ...newSupplier, NomSociete: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        placeholder="Ex: SARL El Amine Commerce"
                        readOnly={isEditing}
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">RC</label>
                    <input
                        type="text"
                        value={newSupplier.Rc}
                        onChange={(e) => setNewSupplier({ ...newSupplier, Rc: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        placeholder="Ex: 16B1234567"
                        readOnly={isEditing}
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm mb-1">Nature juridique *</label>
                    <select
                        value={newSupplier.NatureJuridique}
                        onChange={(e) => setNewSupplier({ ...newSupplier, NatureJuridique: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        disabled={isEditing}
                    >
                        <option value="" disabled>Sélectionner la nature juridique</option>
                        <option>SARL</option>
                        <option>EURL</option>
                        <option>SPA</option>
                        <option>SNC</option>
                        <option>Entreprise individuelle</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm mb-1">AI</label>
                    <input
                        type="text"
                        value={newSupplier.Ai}
                        onChange={(e) => setNewSupplier({ ...newSupplier, Ai: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        placeholder="Ex: 12345678"
                        readOnly={isEditing}
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm mb-1">NIF *</label>
                    <input
                        type="text"
                        value={newSupplier.Nif}
                        onChange={(e) => setNewSupplier({ ...newSupplier, Nif: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        placeholder="Ex: 000616080698110"
                        readOnly={isEditing}
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">Téléphone</label>
                    <input
                        type="text"
                        value={newSupplier.Telephone}
                        onChange={(e) => setNewSupplier({ ...newSupplier, Telephone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        placeholder="Ex: 0661 02 03 04"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input
                        type="email"
                        value={newSupplier.Email}
                        onChange={(e) => setNewSupplier({ ...newSupplier, Email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        placeholder="Ex: fournisseur@email.com"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">Agence Bancaire</label>
                    <input
                        type="text"
                        value={newSupplier.AgenceBancaire}
                        onChange={(e) => setNewSupplier({ ...newSupplier, AgenceBancaire: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        placeholder="Ex: Banque Nationale, Annaba"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm mb-1">RIB</label>
                    <input
                        type="text"
                        value={newSupplier.Rib}
                        onChange={(e) => setNewSupplier({ ...newSupplier, Rib: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        placeholder="Ex: 001002030400500600"
                        readOnly={isEditing}
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">Adresse</label>
                    <textarea
                        value={newSupplier.Adresse}
                        onChange={(e) => setNewSupplier({ ...newSupplier, Adresse: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        rows={1}
                        placeholder="Ex: 10 Rue Pasteur, Annaba"
                    />
                </div>
            </div>
        </div>
    );
}
