import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAllAnnonces, newAnnonce, updateAnnonce, deleteAnnonce } from '../services/annonceService';
import { AnnouncementsTable } from './tables/AnnouncementsTable';
import { FormModal } from './modals/FormModal';
import { NewAnnounceForm } from './modals/NewAnnounceForm';
import { useToast } from '../hooks/useToast';

export function AnnouncementSubSection({ operations }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const [newAnnouncement, setNewAnnouncement] = useState({
    operationId: '',
    numero: '',
    datePublication: new Date().toISOString().split('T')[0],
    journal: 'BOMOP',
    delai: '',
    dateOuverture: '',
    heureOuverture: '',
  });

  const fetchAnnouncements = async () => {
    const currentAdmin = user?.userId || user?.userid;
    if (currentAdmin) {
      setLoading(true);
      try {
        const response = await getAllAnnonces(currentAdmin);
        const data = response.annonces || response.data || response; 
        setAnnouncements(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
        showToast('Impossible de charger la liste des annonces.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };
  
  useEffect(() => {
    fetchAnnouncements();
  }, [user]);

  const handleOpenModal = (announcement) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setNewAnnouncement({
        operationId: announcement.Id_Operation,
        numero: announcement.Numero,
        datePublication: announcement.Date_Publication ? new Date(announcement.Date_Publication).toISOString().split('T')[0] : '',
        journal: announcement.Journal,
        delai: announcement.Delai,
        dateOuverture: announcement.Date_Overture ? new Date(announcement.Date_Overture).toISOString().split('T')[0] : '',
        heureOuverture: announcement.Heure_Ouverture
      });
    } else {
      setEditingAnnouncement(null);
      setNewAnnouncement({
        
        operationId: operations && operations.length > 0 ? operations[0].id : '',
        numero: '',
        datePublication: new Date().toISOString().split('T')[0],
        journal: 'BOMOP',
        delai: '',
        dateOuverture: '',
        heureOuverture : '',
      });
    }
    setShowModal(true);
  };
  
  const handleModalClose = () => {
    setShowModal(false);
    setEditingAnnouncement(null);
  }

  const handleSaveAnnouncement = async () => {
    if (!newAnnouncement.operationId || !newAnnouncement.numero) {
      showToast('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    const formData = {
        Id_Operation: newAnnouncement.operationId,
        Numero: newAnnouncement.numero,
        Date_Publication: newAnnouncement.datePublication,
        Journal: newAnnouncement.journal,
        Delai: newAnnouncement.delai,
        Date_Overture: newAnnouncement.dateOuverture,
        Heure_Ouverture : newAnnouncement.heureOuverture,
        adminId: user?.userId || user?.userid
    };

    if (editingAnnouncement) {
        try {
            const dataToUpdate = { ...formData, Id: editingAnnouncement.Id };
            const result = await updateAnnonce(dataToUpdate);
            if (result.success) {
                await fetchAnnouncements(); 
                handleModalClose();
                showToast('Annonce modifiée avec succès.', 'success');
            } else {
                showToast('Impossible de modifier l\'annonce.', 'error');
            }
        } catch (error) {
            showToast('Erreur lors de la modification de l\'annonce.', 'error');
        }
    } else {
        try {
            const result = await newAnnonce(formData);
            if (result.success) {
                await fetchAnnouncements();
                handleModalClose();
                showToast('Annonce ajoutée avec succès.', 'success');
            } else {
                showToast(result.message || 'Impossible d\'ajouter l\'annonce.', 'error');
            }
        } catch (error) {
            showToast('Erreur lors de l\'ajout de l\'annonce.', 'error');
        }
    }
  };

  const handleDeleteAnnouncement = async (id) => {
      try {
          const result = await deleteAnnonce(id);
          if(result.success) {
              setAnnouncements(prev => prev.filter(ann => ann.Id !== id));
              showToast('Annonce supprimée avec succès.', 'success');
          } else {
              showToast('Impossible de supprimer l\'annonce.', 'error');
          }
      } catch (error) {
          showToast('Erreur lors de la suppression de l\'annonce.', 'error');
      }
  };

  
  const getOperationNumero = (operationId) => {
    const operation = operations.find(op => op.id === operationId);
    return operation ? operation.NumOperation : 'N/A';
  };

  const filteredAnnouncements = announcements.filter(ann => {
    if (!ann) return false;
    const term = searchTerm.toLowerCase();
    const opNum = getOperationNumero(ann.Id_Operation).toLowerCase();
    const journal = (ann.Journal || '').toLowerCase();
    const num = (ann.Numero || '').toLowerCase();

    return opNum.includes(term) || journal.includes(term) || num.includes(term);
  });
  
  if (loading) {
    return <div className="p-6 text-center">Chargement des annonces...</div>;
  }

  return (
    <>
      <section className="bg-white border border-gray-300 rounded">
        <div className="border-b border-gray-300 bg-gray-100 px-6 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 flex items-center gap-2 text-sm disabled:bg-slate-400"
            >
              <Plus className="w-4 h-4" />
              Ajouter Annonce
            </button>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                 placeholder="N° d'announce our journal"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded w-64 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
            <AnnouncementsTable 
                announcements={filteredAnnouncements} 
                getOperationNumero={getOperationNumero} 
                handleOpenModal={handleOpenModal} 
                handleDeleteAnnouncement={handleDeleteAnnouncement} 
            />
        </div>
      </section>

      <FormModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSave={handleSaveAnnouncement}
        title={editingAnnouncement ? "Modifier l'annonce" : 'Nouvelle Annonce'}
        saveText={editingAnnouncement ? 'Modifier' : 'Ajouter'}
      >
        <NewAnnounceForm 
            newAnnouncement={newAnnouncement} 
            setNewAnnouncement={setNewAnnouncement} 
            operations={operations} 
            isEditing={editingAnnouncement}
        />
      </FormModal>
    </>
  );
}