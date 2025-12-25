import { Edit2, Trash2 } from "lucide-react";

export function SuppliersTable({ suppliers, handleModalOpen, handleDeleteSupplier }) {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead className="bg-gray-100 sticky top-0">
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-2 text-left">Raison sociale</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Nature juridique</th>
          <th className="border border-gray-300 px-4 py-2 text-left">RC</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Téléphone</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Opérations</th>
          <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map((supplier) => (
          <tr key={supplier.Id} className="hover:bg-gray-50">
            <td className="border border-gray-300 px-4 py-2">{supplier.NomSociete}</td>
            <td className="border border-gray-300 px-4 py-2">{supplier.NatureJuridique}</td>
            <td className="border border-gray-300 px-4 py-2">{supplier.Rc}</td>
            <td className="border border-gray-300 px-4 py-2">{supplier.Telephone}</td>
            <td className="border border-gray-300 px-4 py-2">
                <div className="flex items-center gap-2">
                  Not yet applied
                </div>
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
                <div className="flex justify-center items-center gap-2">
                    <button onClick={() => handleModalOpen(supplier)} className="text-blue-600 hover:text-blue-800"><Edit2 className="w-5 h-5" /></button>
                    <button onClick={() => handleDeleteSupplier(supplier.Id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5" /></button>
                </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
