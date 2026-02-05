import { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';
import { deleteRetrait } from '../services/retraitService';
import { SpecificationsTable } from './tables/SpecificationsTable';
import { useToast } from '../hooks/useToast';
import { SectionsModal } from "./modals/SectionsModal";

export function SpecificationsSection({ operationID, Specifications, refreshData }) {

  useEffect(()=>{
    console.log('Operation ID In SpecificationSection.jsx : ', operationID);
  },[])
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDeleteRetrait = async (supplierId) => {
    try {
      // Use the operationID from props instead of passing it as parameter
      const response = await deleteRetrait(supplierId, operationID);
      console.log('Delete response:', response);

      if (response.success) {
        showToast(response.message || 'Retrait supprimé avec succès', 'success');
        refreshData(); 
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
        <SectionsModal
          title="Cahiers de Charges"
          icon={null}
          buttonText={"Selection Fournisseur"}
          showSearch={false}
          showFilter={false}
        >
          {Specifications && Specifications.length > 0 ? (
            <SpecificationsTable
              specifications={Specifications}
              handleDeleteRetrait={handleDeleteRetrait}
              operationID={operationID} 
            />
          ) : (
            <div className="text-center text-gray-400 py-8">Aucune Acquisition de cahier de charge trouvée.</div>
          )}
        </SectionsModal>
      </div>
    </div>
  );
}
