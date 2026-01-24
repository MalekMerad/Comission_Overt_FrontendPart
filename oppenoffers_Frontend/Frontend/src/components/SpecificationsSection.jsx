import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import { getSuppliersWithOperations, deleteRetrait } from '../services/retraitService';
import { getOperations } from '../services/operationService';
import { SpecificationsTable } from './tables/SpecificationsTable';
import { useToast } from '../hooks/useToast';

export function SpecificationsSection() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [operations, setOperations] = useState([]);
  const [cahierDeCharges, setCahierDeCharges] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOperationId, setSelectedOperationId] = useState('');
  const [operationSearch, setOperationSearch] = useState('');
  const [showOperationDropdown, setShowOperationDropdown] = useState(false);

  // Ref to track if initial data fetch is done
  const dataFetchedRef = useRef(false);

  // Fetch operations and suppliers data ONCE when user.userId is available
  useEffect(() => {
    // If user is not present, don't fetch
    if (!user?.userId) return;
    // Prevent multiple fetches of the same data
    if (dataFetchedRef.current) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch operations and suppliers in parallel
        const [opsResponse, suppliersResponse] = await Promise.all([
          getOperations(user.userId),
          getSuppliersWithOperations(user.userId)
        ]);

        // Handle operations
        const rawOps = Array.isArray(opsResponse) ? opsResponse : (opsResponse?.data || []);
        setOperations(rawOps.filter(op => op.State === 1));

        // Handle suppliers
        if (suppliersResponse.success) {
          setCahierDeCharges(suppliersResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        showToast('Erreur de chargement des données', 'error');
      } finally {
        setLoading(false);
        dataFetchedRef.current = true;
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, [user?.userId]); // Only rerun when user.userId changes

  // Find selected operation object
  const selectedOperation = operations.find(op => 
    String(op.Id || op.id) === String(selectedOperationId)
  );

  // Filter operations based on search
  const filteredOperations = operations.filter(op =>
    (op.Numero || '').toLowerCase().includes(operationSearch.toLowerCase()) ||
    (op.Service_Contractant || '').toLowerCase().includes(operationSearch.toLowerCase())
  );

  // Filter suppliers based on selected operation and search term
  useEffect(() => {
    let filtered = cahierDeCharges;
    
    // First filter by selected operation if one is selected
    if (selectedOperationId) {
      filtered = filtered.filter(supplier => 
        String(supplier.OperationId) === String(selectedOperationId)
      );
    }
    
    // Then apply search term filter
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      filtered = filtered.filter(supplier => {
        const nomPrenom = (supplier.NomPrenom || '').toLowerCase();
        const telephone = (supplier.Telephone || '').toLowerCase();
        const email = (supplier.Email || '').toLowerCase();
        const numeroOperation = (supplier.NumeroOperation || '').toLowerCase();
        const serviceOperation = (supplier.ServiceOperation || '').toLowerCase();
        const objectOperation = (supplier.ObjectOperation || '').toLowerCase();
        
        return (
          nomPrenom.includes(term) ||
          telephone.includes(term) ||
          email.includes(term) ||
          numeroOperation.includes(term) ||
          serviceOperation.includes(term) ||
          objectOperation.includes(term)
        );
      });
    }
    
    setFilteredSuppliers(filtered);
  }, [selectedOperationId, searchTerm, cahierDeCharges]);

  const handleDeleteRetrait = async (supplierId, operationId) => {
    try {
      console.log('Deleting retrait:', { supplierId, operationId });
      const response = await deleteRetrait(supplierId, operationId);
      console.log('Delete response:', response);

      if (response.success) {
        // Remove the deleted item from state
        setCahierDeCharges(prev => prev.filter( 
          s => !(s.Id === supplierId && s.OperationId === operationId)
        ));
        showToast(response.message || 'Retrait supprimé avec succès', 'success');
      } else {
        if (response.code === 1002) {
          showToast('Aucun retrait trouvé pour cette opération et fournisseur', 'warning');
        } else {
          showToast(response.message || 'Erreur lors de la suppression', 'error');
        }
      }
    } catch (error) {
      console.error('Error in handleDeleteRetrait:', error);
      showToast('Erreur de connexion au serveur', 'error');
    }
  };

  if (loading) {
    return <div className="p-8">Chargement des données...</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <section className="bg-white border border-gray-300 rounded">
          {/* Header with operation selector and search */}
          <div className="border-b border-gray-300 bg-gray-100 px-6 py-4">
            <div className="flex flex-row items-center justify-between gap-4 mb-1 w-full">
              {/* Operation Selector (left side, fixed width or max-w) */}
              <div className="relative min-w-[260px] max-w-[340px] w-full mr-4">
                <button
                  id="operation-select-specifications"
                  type="button"
                  className="w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 flex justify-between items-center text-left"
                  onClick={() => setShowOperationDropdown((open) => !open)}
                >
                  <span className="truncate text-sm cursor-pointer">
                    {selectedOperation
                      ? `${selectedOperation.Numero} - ${selectedOperation.Service_Contractant}`
                      : "Sélectionner une opération"}
                  </span>
                  <svg 
                    className={`w-5 h-5 ml-3 transition-transform ${showOperationDropdown ? "rotate-180" : "rotate-0"}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Operation Dropdown Menu */}
                {showOperationDropdown && (
                  <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-auto max-h-72">
                    <div className="px-3 py-2 border-b flex items-center gap-2 sticky top-0 bg-white z-10">
                      <Search className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Rechercher une opération..."
                        className="outline-none w-full bg-transparent text-sm py-1"
                        autoFocus
                        value={operationSearch}
                        onChange={e => setOperationSearch(e.target.value)}
                      />
                    </div>
                    <ul className="max-h-56 overflow-y-auto">
                      <li 
                        className="cursor-pointer px-4 py-2 text-gray-600 text-sm hover:bg-slate-100" 
                        onClick={() => { 
                          setSelectedOperationId(""); 
                          setShowOperationDropdown(false);
                          setOperationSearch('');
                        }}
                      >
                        Sélectionner une opération
                      </li>
                      {filteredOperations.map(op => (
                        <li
                          key={op.Id || op.id}
                          className={`cursor-pointer px-4 py-2 text-gray-900 text-sm hover:bg-indigo-50 ${
                            String(selectedOperationId) === String(op.Id || op.id) 
                              ? "bg-indigo-100 font-bold" 
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedOperationId(op.Id || op.id);
                            setShowOperationDropdown(false);
                            setOperationSearch('');
                          }}
                        >
                          {op.Numero} - {op.Service_Contractant}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Search Input (right side, flexible width) */}
              <div className="relative min-w-[160px] w-full max-w-xs ml-auto">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par fournisseur ou opération"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full text-sm focus:ring-2 focus:ring-slate-200 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Operation Info Section (if operation is selected) */}
          {selectedOperationId && (
            <div className="border-b border-gray-300 px-6 py-3 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-800">
                  Opération: {selectedOperation?.Numero}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">
                    {filteredSuppliers.length} {filteredSuppliers.length > 1 ? 'fournisseurs trouvés' : 'fournisseur trouvé'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="p-6">
            {selectedOperationId ? (
              filteredSuppliers.length > 0 ? (
                <SpecificationsTable
                  specifications={filteredSuppliers}
                  handleDeleteRetrait={handleDeleteRetrait}
                />
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    Aucun fournisseur trouvé pour cette opération
                    {searchTerm && ` avec le terme "${searchTerm}"`}
                  </p>
                </div>
              )
            ) : searchTerm ? (
              filteredSuppliers.length > 0 ? (
                <SpecificationsTable
                  specifications={filteredSuppliers}
                  handleDeleteRetrait={handleDeleteRetrait}
                />
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    Aucun fournisseur trouvé avec le terme "{searchTerm}"
                  </p>
                </div>
              )
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  {operations.length > 0 
                    ? "Sélectionnez une opération pour voir les fournisseurs" 
                    : "Aucune opération disponible"}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}