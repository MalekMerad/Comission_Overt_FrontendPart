import { useEffect, useState } from "react";
import SearchBar from "../SearchBar";
import deleteIcon from "../../assets/supprimer.png";
import "../../../styles/componentsStyles/DisplaySuppliers.css";
import "../../../styles/BtnClose.css";
import DeleteConfirmation from "../DeleteConfirmation";
//import TextInput from "../FormElements/TextInput";
//import TextArea from "../FormElements/TextArea";
import { deleteSupplier, getAllSuppliers, updateSupplier } from "../../services/supplierService";
import { useToast } from "../../hooks/useToast";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useAuth } from "../../context/AuthContext";

function DisplaySuppliers() {
  const { showToast } = useToast();
  const { isOpen: isDeleteModalOpen, open: openDeleteModal, close: closeDeleteModal } = useDisclosure();

  const [fournisseurs, setFournisseurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFournisseur, setSelectedFournisseur] = useState(null);
  const [editFournisseur, setEditFournisseur] = useState(null);
  const [fournisseurToDelete, setFournisseurToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  //CURRENT ADMIN
  const {user} = useAuth();
  const adminId = user?.userId;

  useEffect(() => {

    const loadSuppliers = async () => {
      try {
        const res = await getAllSuppliers(adminId);
        console.log("API response:", res);

        console.log("✅ API response:", res);
        setFournisseurs(res.suppliers || []);
      } catch (error) {
        console.error("❌ Fetch suppliers error:", error);
        showToast("Erreur lors du chargement des fournisseurs", "error");
      } finally {
        setLoading(false);
      }
    };

    loadSuppliers();
  }, []);

  const filteredFournisseurs = fournisseurs.filter(
    (f) => f.NomSociete.toLowerCase().includes(searchTerm.toLowerCase()) ||
           f.Rc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteRequest = (f) => {
    setFournisseurToDelete(f);
    openDeleteModal();
  };


  const handleConfirmDelete = async () => {
    if (!fournisseurToDelete) return;

    const res = await deleteSupplier(fournisseurToDelete.Id);

    if (res.success) {
        setFournisseurs(fournisseurs.filter(f => f.Id !== fournisseurToDelete.Id));
        showToast(`Fournisseur ${fournisseurToDelete.NomSociete} supprimé`, "success");
    } else {
        showToast("Erreur lors de la suppression", "error");
    }

    closeDeleteModal();
};

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFournisseur({ ...editFournisseur, [name]: value });
  };

  const handleUpdate = async () => {
    try {
        const result = await updateSupplier(editFournisseur);

        if (result && typeof result.code !== 'undefined') {
            switch (result.code) {
                case 0:
                    setFournisseurs((prev) =>
                        prev.map((f) => (f.Id === editFournisseur.Id ? editFournisseur : f))
                    );
                    showToast("Mise à jour effectuée", "success");
                    setSelectedFournisseur(null);
                    break;

                case 1004:
                    showToast("Un fournisseur avec ce numéro de téléphone existe déjà.", "warning");
                    break;

                case 1007:
                    showToast("Un fournisseur avec cet email existe déjà.", "warning");
                    break;

                case 5000:
                    showToast("Une erreur générale est survenue. Veuillez réessayer.", "error");
                    break;

                default:
                    showToast(`Réponse inattendue du serveur (code: ${result.code}).`, "error");
            }
        } else {
            showToast("Réponse inattendue du serveur.", "error");
        }
    } catch (error) {
        console.error(error);
        showToast("Erreur lors de la mise à jour du fournisseur.", "error");
    }
  };

  if (loading) return <p className="loading">Chargement...</p>;

  const handlePanelCancel = () => {
    setSelectedFournisseur(null);
  };

  return (
    <div className="DisplayFourns-container">
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Rechercher fournisseur (nom ou RC)"
        title="Recherche d'un fournisseur :"
      />

      <div className="fourns-display">
        {filteredFournisseurs.length > 0 ? (
          filteredFournisseurs.map((f) => (
            <div key={f.Id} className="fourns-card">
              <div className="fourns-card-header">
                <h2>Nom société : <span className="fourns-numero">{f.NomSociete}</span></h2>
                  <button
                  className="delete-btn-fourns"
                  onClick={() => handleDeleteRequest(f)}
                  >
                  <img src={deleteIcon} alt="delete" className="delete-icon-img-fourns" />
                </button>
              </div>
              <p><strong>Email :</strong> {f.Email}</p>
              <p><strong>Adresse :</strong> {f.Adresse}</p>
              <p><strong>Téléphone :</strong> {f.Telephone}</p>
              <p><strong>RC :</strong> {f.Rc}</p>
              <p><strong>NIF :</strong> {f.Nif}</p>

              <div className="fourns-actions">
              <button
                  className="details-btn-fourns"
                  onClick={() => {
                    setSelectedFournisseur(f);
                    setEditFournisseur({ ...f });
                  }}
                >
                  Voir détails
                </button>
                <button className="details-btn-fourns" style={{ backgroundColor: 'red' }}>
                  attribuer opération
                </button>
    
              </div>
            </div>
          ))
        ) : (
                <div style={{ color: "#777", fontStyle: 'italic', textAlign: 'center' }}>
                    Aucune opération trouvée.
                </div>
        )}
      </div>

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmation"
        message={`Voulez-vous supprimer ${fournisseurToDelete?.NomSociete} ?`}
      />

      {selectedFournisseur && (
        <div className="modal-overlay-large-fourns">
          <div className="modal-large-content-fourns">
            <div className="modal-header">
              <h3>Détails du fournisseur</h3>
              <button className="modal-close-btn" onClick={handlePanelCancel}>✕</button>
            </div>

            <div className="modal-form-grid-fourns">
              {["NomSociete","NatureJuridique","Adresse","Telephone","Rc","Nif","Rib","Email","Ai","AgenceBancaire"].map((field) => (
                <label key={field}>
                  {field.replace(/([A-Z])/g, " $1")} :
                  <input
                    type={field === "Email" ? "email" : "text"}
                    name={field}
                    value={editFournisseur[field]}
                    onChange={handleEditChange}
                    disabled={["Rc", "Nif", "Rib", "Ai"].includes(field)}
                  />
                </label>
              ))}
            </div>

            <div className="modal-buttons-fourns">
              <button className="save-btn-fourns" onClick={handleUpdate}>Enregistrer</button>
              <button className="cancel-btn-fourns" onClick={handlePanelCancel}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplaySuppliers;
/*<TextInput
                label="Nom Société"
                name="NomSociete"
                value={editFournisseur.NomSociete}
                onChange={handleEditChange}
              />

              <TextInput
                label="Nature Juridique"
                name="NatureJuridique"
                value={editFournisseur.NatureJuridique}
                onChange={handleEditChange}
              />

              <TextArea
                label="Adresse"
                name="Adresse"
                value={editFournisseur.Adresse}
                onChange={handleEditChange}
              />

              <TextInput
                label="Téléphone"
                name="Telephone"
                value={editFournisseur.Telephone}
                onChange={handleEditChange}
              />

              <TextInput
                label="RC"
                name="Rc"
                value={editFournisseur.Rc}
                onChange={handleEditChange}
              />

              <TextInput
                label="NIF"
                name="Nif"
                value={editFournisseur.Nif}
                onChange={handleEditChange}
              />

              <TextInput
                label="RIB"
                name="Rib"
                value={editFournisseur.Rib}
                onChange={handleEditChange}
              />

              <TextInput
                label="Email"
                name="Email"
                type="email"
                value={editFournisseur.Email}
                onChange={handleEditChange}
              />

              <TextInput
                label="AI"
                name="Ai"
                value={editFournisseur.Ai}
                onChange={handleEditChange}
              />

              <TextInput
                label="Agence Bancaire"
                name="AgenceBancaire"
                value={editFournisseur.AgenceBancaire}
                onChange={handleEditChange}
              />*/