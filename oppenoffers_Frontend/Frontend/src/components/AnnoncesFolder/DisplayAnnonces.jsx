import { useEffect, useState } from "react";
import "../../../styles/componentsStyles/ALLAnnonces.css";
import SearchBar from "../../components/SearchBar";
import deleteIcon from "../../assets/supprimer.png";
import "../../../styles/componentsStyles/DisplayLots.css";
import {
  getAllAnnonces,
  deleteAnnonce,
  updateAnnonce,
} from "../../services/annonceService";
import { useToast } from "../../hooks/useToast";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useAuth } from "../../context/AuthContext";
import DeleteConfirmation from "../DeleteConfirmation";
import TextInput from "../FormElements/TextInput";

function DisplayAnnonces() {
  const { showToast } = useToast();
  const { user } = useAuth();

  const { isOpen: isDeleteModalOpen, open: openDeleteModal, close: closeDeleteModal } = useDisclosure();
  const [annonces, setAnnonces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);
  const [editAnnonce, setEditAnnonce] = useState(null);
  const [annonceToDelete, setAnnonceToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllAnnonces(user?.userId);
        setAnnonces(data || []);
        showToast(`${data.length} annonce(s) chargée(s) avec succès ✅`, 'success');
      } catch (error) {
        console.error("Erreur:", error);
        showToast("❌ Impossible de charger les annonces.", 'error');
      }
    };
    fetchData();
  }, []);

  const filteredAnnonces = annonces.filter(
    (annonce) =>
      annonce.Numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      annonce.Journal?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteRequest = (annonce) => {
    setAnnonceToDelete(annonce);
    openDeleteModal();
  };

  const handleConfirmDelete = async () => {
    if (!annonceToDelete) return;

    try {
      const result = await deleteAnnonce(annonceToDelete.Id || annonceToDelete.id || annonceToDelete.Id_Annonce || annonceToDelete.id_annonce);
      if (result.success) {
        setAnnonces(annonces.filter(a => (a.Id || a.id || a.Id_Annonce || a.id_annonce) !== (annonceToDelete.Id || annonceToDelete.id || annonceToDelete.Id_Annonce || annonceToDelete.id_annonce)));
        showToast(`🗑️ Annonce ${annonceToDelete.Numero} supprimée avec succès !`, 'success');
      } else {
        throw new Error(result.message || "Erreur lors de la suppression de l'annonce");
      }
    } catch (error) {
      showToast(`❌ Erreur lors de la suppression: ${error.message}`, 'error');
    } finally {
      closeDeleteModal();
      setAnnonceToDelete(null);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditAnnonce({ ...editAnnonce, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const result = await updateAnnonce(editAnnonce);

      if (result.success) {
        setAnnonces((prev) =>
          prev.map((a) => (a.Numero === editAnnonce.Numero ? editAnnonce : a))
        );
        showToast(`✅ Annonce ${editAnnonce.Numero} mise à jour avec succès !`, 'success');
        setSelectedAnnonce(null);
      } else {
        showToast(`⚠️ Erreur lors de la mise à jour : ${result.message || "Réponse invalide du serveur."}`, 'error');
      }
    } catch (error) {
      showToast("❌ Une erreur est survenue lors de la mise à jour.", 'error');
    }
  };

  return (
    <div className="DisplayAnnonces-container">
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Rechercher (numéro ou journal)"
        title="Recherche d'une annonce :"
      />

      <div className="annonces-display">
        {filteredAnnonces.length > 0 ? (
          filteredAnnonces.map((annonce) => {
            const key = annonce.Id ?? annonce.id ?? annonce.Id_Annonce ?? annonce.Numero;
            return (
              <div key={key} className="annonce-card">
                <h2>
                  Numéro d’annonce :{" "}
                  <span className="annonce-numero">{annonce.Numero}</span>
                </h2>
                <p>
                  <strong>Journal :</strong> {annonce.Journal}
                </p>
                <p>
                  <strong>Date de publication :</strong>{" "}
                  {new Date(annonce.Date_Publication).toLocaleDateString()}
                </p>
                <p>
                  <strong>Date d’ouverture :</strong>{" "}
                  {new Date(annonce.Date_Overture).toLocaleDateString()}
                </p>
                <p>
                  <strong>Délai :</strong> {annonce.Delai} jour(s)
                </p>

                <div className="annonce-actions">
                  <button
                    className="details-btn"
                    onClick={() => {
                      setSelectedAnnonce(annonce);
                      setEditAnnonce({ ...annonce });
                    }}
                  >
                    Voir détails
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteRequest(annonce)}
                    title={`Supprimer l'annonce ${annonce.Numero}`}
                  >
                    <img
                      src={deleteIcon}
                      alt="supprimer"
                      className="delete-icon-img"
                    />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-data">Aucune annonce trouvée.</p>
        )}
      </div>

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="⚠️ Confirmation"
        message={`Voulez-vous vraiment supprimer l'annonce ${annonceToDelete?.Numero} ?`}
      />

      {selectedAnnonce && (
        <div className="modal-overlay-large">
          <div className="modal-large-content">
            <h2>Détails et modification de l’annonce</h2>

            <div className="modal-form-grid">
              <TextInput
                label="Numéro :"
                type="text"
                name="Numero"
                value={editAnnonce.Numero}
                disabled
              />

              <TextInput
                label="Journal :"
                type="text"
                name="Journal"
                value={editAnnonce.Journal}
                onChange={handleEditChange}
              />

              <TextInput
                label="Date de publication :"
                type="date"
                name="Date_Publication"
                value={editAnnonce.Date_Publication?.slice(0, 10)}
                onChange={handleEditChange}
              />

              <TextInput
                label="Date d’ouverture :"
                type="date"
                name="Date_Overture"
                value={editAnnonce.Date_Overture?.slice(0, 10)}
                onChange={handleEditChange}
              />

              <TextInput
                label="Délai (jours) :"
                type="number"
                name="Delai"
                value={editAnnonce.Delai}
                onChange={handleEditChange}
              />
            </div>

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleUpdate}>
                💾 Enregistrer
              </button>
              <button
                className="cancel-btn"
                onClick={() => setSelectedAnnonce(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayAnnonces;
