export function NewSupplierForm({ newSupplier, setNewSupplier }) {

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
              </div>
    );
}
