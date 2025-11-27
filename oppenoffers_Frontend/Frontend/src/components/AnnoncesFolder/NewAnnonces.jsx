import { useState } from "react";
import '../../../styles/componentsStyles/ALLOperations.css';
import { newAnnonce } from '../../services/annonceService';
import { useToast } from '../../hooks/useToast';

function NewAnnonces({ operationId, adminId, onClose, onConfirm }) {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        Id_Operation: operationId,
        Numero: "",
        Date_Publication: "",
        Journal: "",
        Delai: "",
        Date_Overture: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const required = [
            "Id_Operation",
            "Numero",
            "Date_Publication",
            "Journal",
            "Delai",
            "Date_Overture"
        ];

        const empty = required.filter(f => !formData[f]);

        if (empty.length > 0) {
            showToast("Veuillez remplir tous les champs obligatoires.", "error");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await newAnnonce({ ...formData, adminId });

            if (res.success) {
                showToast("Annonce ajoutée avec succès !", "success");

                if (onConfirm) onConfirm(res);

                setFormData({
                    Id_Operation: operationId,
                    Numero: "",
                    Date_Publication: "",
                    Journal: "",
                    Delai: "",
                    Date_Overture: ""
                });
            }
            else if (res.code === 1002) {
                showToast("Cette annonce existe déjà.", "warning");
            }
            else {
                showToast("Erreur lors de l'ajout de l'annonce.", "error");
            }

        } catch (err) {
            if (err.validationError) {
                err.validationError.forEach(error => showToast(error, "error"));
            } else {
                showToast("Erreur réseau ou serveur.", "error");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="operation-details-modal">
            <div className="modal-overlay" onClick={onClose}></div>

            <div className="modal-panel">
                <div className="modal-header">
                    <h3>Créer une nouvelle annonce</h3>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="modal-content">

                    <div className="detail-row">
                        <label>Numéro de l'annonce :</label>
                        <input
                            type="text"
                            name="Numero"
                            placeholder="Ex : AN-2025-001"
                            value={formData.Numero}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="detail-row">
                        <label>Date de publication :</label>
                        <input
                            type="date"
                            name="Date_Publication"
                            value={formData.Date_Publication}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="detail-row">
                        <label>Journal :</label>
                        <input
                            type="text"
                            name="Journal"
                            placeholder="Ex : El Moudjahid"
                            value={formData.Journal}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="detail-row">
                        <label>Délai (jours) :</label>
                        <input
                            type="number"
                            name="Delai"
                            placeholder="Ex : 15"
                            value={formData.Delai}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="detail-row">
                        <label>Date d’ouverture :</label>
                        <input
                            type="date"
                            name="Date_Overture"
                            value={formData.Date_Overture}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
                    </div>


                    <div className="modal-actions">
                        <button
                            className="update-operation-btn"
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? "Création..." : "Créer Annonce"}
                        </button>

                        <button
                            className="cancel-operation-btn"
                            disabled={isSubmitting}
                            onClick={onClose}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewAnnonces;
