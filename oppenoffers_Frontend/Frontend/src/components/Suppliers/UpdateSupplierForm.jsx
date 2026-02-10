export function UpdateSupplierForm({ newSupplier, setNewSupplier }) {

    return (
        <div className="space-y-4">
                {/* Row 1: Raison sociale & RC */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-sm mb-1">Nom et Prénom <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newSupplier.NomPrenom}
                      onChange={e =>
                        setNewSupplier({ ...newSupplier, NomPrenom: e.target.value })
                      }
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Ex: Ahmed Benali"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Téléphone <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newSupplier.Telephone}
                      onChange={e => setNewSupplier({ ...newSupplier, Telephone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="Ex: 0661 02 03 04"
                    />
                  </div>
                </div>
                {/* Row 2: Nature juridique & AI */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={newSupplier.Email}
                      onChange={e => setNewSupplier({ ...newSupplier, Email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="Ex: fournisseur@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Raison sociale <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newSupplier.NomSociete}
                      onChange={e => setNewSupplier({ ...newSupplier, NomSociete: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="Ex: SARL El Amine Commerce"
                    />
                  </div>
                </div>
                {/* Row 3: NIF & Téléphone */}
                <div className="grid grid-cols-2 gap-4">
                  
                  <div>
                    <label className="block text-sm mb-1">NIF <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newSupplier.Nif}
                      onChange={e => setNewSupplier({ ...newSupplier, Nif: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="Ex: 000616080698110"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">AI <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newSupplier.Ai}
                      onChange={e => setNewSupplier({ ...newSupplier, Ai: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="Ex: 12345678"
                    />
                  </div>
                </div>
                {/* Row 4: Email & Agence Bancaire */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">RC <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newSupplier.Rc}
                      onChange={e => setNewSupplier({ ...newSupplier, Rc: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="Ex: 16B1234567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">RIB <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newSupplier.Rib}
                      onChange={e => setNewSupplier({ ...newSupplier, Rib: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="Ex: 001002030400500600"
                    />
                  </div>
                </div>
                {/* Row 5: RIB & Adresse */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Nature juridique <span className="text-red-500">*</span></label>
                    <select
                      value={newSupplier.NatureJuridique}
                      onChange={e => setNewSupplier({ ...newSupplier, NatureJuridique: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
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
                    <label className="block text-sm mb-1">Agence Bancaire <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newSupplier.AgenceBancaire}
                      onChange={e => setNewSupplier({ ...newSupplier, AgenceBancaire: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="Ex: Banque Nationale, Annaba"
                    />
                  </div>
                </div>
                  <div>
                    <label className="block text-sm mb-1">Adresse <span className="text-red-500">*</span></label>
                    <textarea
                      value={newSupplier.Adresse}
                      onChange={e => setNewSupplier({ ...newSupplier, Adresse: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      rows={1}
                      placeholder="Ex: 10 Rue Pasteur, Annaba"
                    />
                  </div>
              </div>
    );
}
