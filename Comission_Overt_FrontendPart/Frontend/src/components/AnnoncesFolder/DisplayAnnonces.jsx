import { useEffect, useState } from "react";
import "../../../styles/componentsStyles/ALLAnnonces.css";
import SearchBar from "../../components/SearchBar";
import deleteIcon from "../../assets/supprimer.png";
import "../../../styles/componentsStyles/DisplayLots.css";
import {
  getAllAnnonces,
  deleteAnnonce,
  updateAnnonce,
} from "../../services/AnnoncesServices/AnnoncesSrv";

function DisplayAnnonces() {
  const [annonces, setAnnonces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);
  const [editAnnonce, setEditAnnonce] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllAnnonces();
        setAnnonces(data || []);
        setAlert({
          type: "success",
          message: `${data.length} annonce(s) chargée(s) avec succès ✅`,
        });
      } catch (error) {
        console.error("Erreur:", error);
        setAlert({
          type: "error",
          message: "❌ Impossible de charger les annonces.",
        });
      }
    };
    fetchData();
  }, []);

  // === Effacer automatiquement les alertes ===
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ type: "", message: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // === Recherche ===
  const filteredAnnonces = annonces.filter(
    (annonce) =>
      annonce.Numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      annonce.Journal?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteRequest = (annonce) => {
    if (!annonce) return;

    const resolvedId =
      annonce.Id ??
      annonce.id ??
      annonce.Id_Annonce ??
      annonce.id_annonce ??
      null;

    setConfirmDelete(
      resolvedId
        ? {
            id: resolvedId,
            numero: annonce.Numero,
            journal: annonce.Journal,
          }
        : null
    );
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;

    const { id, numero, journal } = confirmDelete;

    try {
      if (!id) {
        throw new Error("ID de l'annonce introuvable");
      }

      setAnnonces((prev) =>
        prev.filter((a) => {
          const currentId =
            a.Id ?? a.id ?? a.Id_Annonce ?? a.id_annonce ?? null;
          return currentId ? currentId !== id : a.Numero !== numero;
        })
      );

      const result = await deleteAnnonce(id);

      if (result.success) {
        setAlert({
          type: "success",
          message: `🗑️ Annonce ${numero} supprimée avec succès !`,
        });
      } else {
        throw new Error(
          result.message ||
            (result.code === 1004
              ? "Annonce non trouvée sur le serveur"
              : "Erreur lors de la suppression de l'annonce")
        );
      }
    } catch (error) {
      console.error("Delete error:", error);

      try {
        const data = await getAllAnnonces();
        setAnnonces(data || []);
      } catch (fetchError) {
        console.error("Failed to refetch announcements:", fetchError);
        setAlert({
          type: "error",
          message: `❌ Erreur de synchronisation: ${
            error.message || "Veuillez actualiser la page."
          }`,
        });
      }

      let userMessage = `❌ Erreur lors de la suppression: ${
        error.message || "Opération échouée."
      }`;

      if (error.message?.toLowerCase().includes("network")) {
        userMessage =
          "❌ Erreur de connexion. Vérifiez votre réseau et réessayez.";
      } else if (error.message?.toLowerCase().includes("introuvable")) {
        userMessage = "❌ Annonce introuvable ou déjà supprimée.";
      }

      setAlert({
        type: "error",
        message: userMessage,
      });
    } finally {
      setConfirmDelete(null);
    }
  };
  
  const handleCancelDelete = () => {
    setConfirmDelete(null);
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
        setAlert({
          type: "success",
          message: `✅ Annonce ${editAnnonce.Numero} mise à jour avec succès !`,
        });
        setSelectedAnnonce(null);
      } else {
        setAlert({
          type: "error",
          message: `⚠️ Erreur lors de la mise à jour : ${
            result.message || "Réponse invalide du serveur."
          }`,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      setAlert({
        type: "error",
        message: "❌ Une erreur est survenue lors de la mise à jour.",
      });
    }
  };

  return (
    <div className="DisplayAnnonces-container">
      {/* === Alertes globales === */}
      {alert.message && (
        <div className={`alert ${alert.type}`}>{alert.message}</div>
      )}

        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          placeholder="Rechercher (numéro ou journal)"
          title="Recherche d'une annonce :" 
        />

      {/* === Liste des annonces === */}
      <div className="annonces-display">
        {filteredAnnonces.length > 0 ? (
          filteredAnnonces.map((annonce) => {
            const key =
              annonce.Id ??
              annonce.id ??
              annonce.Id_Annonce ??
              annonce.Numero;

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

      {/* === Fenêtre modale de confirmation de suppression === */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="confirm-box">
            <h3>⚠️ Confirmation</h3>
            <p>
              Voulez-vous vraiment supprimer l'annonce{" "}
              <strong>{confirmDelete.numero}</strong> ?
              <br />
              <small>Journal: {confirmDelete.journal}</small>
            </p>
            <div className="confirm-buttons">
              <button className="confirm-yes" onClick={handleConfirmDelete}>
                Oui, supprimer
              </button>
              <button className="confirm-no" onClick={handleCancelDelete}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      {/* === Modal détails + mise à jour === */}
      {selectedAnnonce && (
        <div className="modal-overlay-large">
          <div className="modal-large-content">
            <h2>Détails et modification de l’annonce</h2>

            <div className="modal-form-grid">
              <label>
                Numéro :
                <input
                  type="text"
                  name="Numero"
                  value={editAnnonce.Numero}
                  disabled
                />
              </label>

              <label>
                Journal :
                <input
                  type="text"
                  name="Journal"
                  value={editAnnonce.Journal}
                  onChange={handleEditChange}
                />
              </label>

              <label>
                Date de publication :
                <input
                  type="date"
                  name="Date_Publication"
                  value={editAnnonce.Date_Publication?.slice(0, 10)}
                  onChange={handleEditChange}
                />
              </label>

              <label>
                Date d’ouverture :
                <input
                  type="date"
                  name="Date_Overture"
                  value={editAnnonce.Date_Overture?.slice(0, 10)}
                  onChange={handleEditChange}
                />
              </label>

              <label>
                Délai (jours) :
                <input
                  type="number"
                  name="Delai"
                  value={editAnnonce.Delai}
                  onChange={handleEditChange}
                />
              </label>
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
