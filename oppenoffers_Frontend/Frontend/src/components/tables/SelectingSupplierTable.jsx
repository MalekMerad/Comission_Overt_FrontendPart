export function SupplierListTable({ 
    filteredSuppliers, 
    selectedOperationForSupplier, 
    handleAssignSupplier 
  }) {
    return (
      <div className={`w-full ${filteredSuppliers.length > 6 ? "max-h-72 overflow-y-auto" : ""}`} 
           style={{ minWidth: '100%', scrollbarWidth: 'thin' }}>
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Nom & Prénom</th>
              <th className="border px-4 py-2 text-left">Téléphone</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Adresse</th>
              <th className="border px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => {
              let alreadyAssigned = supplier.operationID === selectedOperationForSupplier;
              return (
                <tr key={supplier.Id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{supplier.NomPrenom}</td>
                  <td className="border border-gray-300 px-4 py-2">{supplier.Telephone}</td>
                  <td className="border border-gray-300 px-4 py-2">{supplier.Email}</td>
                  <td className="border border-gray-300 px-4 py-2">{supplier.Adresse}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {alreadyAssigned ? (
                      <span className="text-sm text-gray-500 italic">Déjà assigné</span>
                    ) : (
                      <button
                        onClick={() => handleAssignSupplier(supplier.Id)}
                        className="px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-800 text-sm transition-colors"
                      >
                        Sélectionner
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredSuppliers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  Aucun fournisseur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }