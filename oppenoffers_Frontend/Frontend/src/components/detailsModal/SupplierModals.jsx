import { useState } from 'react';
import { X, Plus, Search } from 'lucide-react';
import { NewSupplierForm } from '../modals/NewSupplierForm';

export function SupplierModals({
  showSupplierModal,
  setShowSupplierModal,
  suppliers,
  selectedOperationForSupplier,
  handleAssignSupplier,
  showNewSupplierModal,
  setShowNewSupplierModal,
  newSupplier,
  setNewSupplier,
  handleAddNewSupplier,
  isEditing
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const safeLower = val => (typeof val === 'string' ? val.toLowerCase() : '');

  const filteredSuppliers = (suppliers || []).filter(supplier =>
    safeLower(supplier?.NomPrenom).includes(safeLower(searchTerm)) ||
    safeLower(supplier?.Telephone).includes(safeLower(searchTerm)) ||
    safeLower(supplier?.Email).includes(safeLower(searchTerm)) ||
    safeLower(supplier?.Adresse).includes(safeLower(searchTerm))
  );

  return (
    <>
      {/* Supplier Selection Modal */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-white/120 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded border-2 border-gray-400 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-300 bg-gray-100 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg">Sélectionner un fournisseur</h3>
              <button onClick={() => setShowSupplierModal(false)} className="text-gray-600 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <button
                  onClick={() => setShowNewSupplierModal(true)}
                  className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 flex items-center gap-2 text-sm disabled:bg-slate-400"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter Nouveau Fournisseur
                </button>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nom, téléphone, email ou adresse"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded w-64 text-sm"
                  />
                </div>
              </div>

              <div className={`w-full ${filteredSuppliers.length > 6 ? "max-h-72 overflow-y-auto" : ""}`} style={{ minWidth: '100%', scrollbarWidth: 'thin' }}>
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Nom & Prénom</th>
                      <th className="border px-4 py-2">Téléphone</th>
                      <th className="border px-4 py-2">Email</th>
                      <th className="border px-4 py-2">Adresse</th>
                      <th className="border px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuppliers.map((supplier) => {
                      const alreadyAssigned =
                        Array.isArray(supplier.operationsAssignees) &&
                        selectedOperationForSupplier &&
                        supplier.operationsAssignees.some(
                          op => String(op).trim() === String(selectedOperationForSupplier).trim()
                        );

                      return (
                        <tr key={supplier.Id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">{supplier.NomPrenom}</td>
                          <td className="border border-gray-300 px-4 py-2">{supplier.Telephone}</td>
                          <td className="border border-gray-300 px-4 py-2">{supplier.Email}</td>
                          <td className="border border-gray-300 px-4 py-2">{supplier.Adresse}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            {alreadyAssigned ? (
                              <span className="text-sm text-gray-500">Déjà assigné</span>
                            ) : (
                              <button
                                onClick={() => handleAssignSupplier(supplier.Id)}
                                className="px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-800 text-sm"
                              >
                                Sélectionner
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Supplier Modal */}
      {showNewSupplierModal && (
        <div className="fixed inset-0 bg-white/120 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded border-2 border-gray-400 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-300 bg-gray-100 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg">Nouveau fournisseur</h3>
              <button onClick={() => setShowNewSupplierModal(false)} className="text-gray-600 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <NewSupplierForm
                newSupplier={newSupplier}
                setNewSupplier={setNewSupplier}
                isEditing={isEditing}
              />

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => setShowNewSupplierModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddNewSupplier}
                  className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800"
                >
                  Ajouter le fournisseur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
