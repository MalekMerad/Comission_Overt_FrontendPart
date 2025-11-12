import { useState } from "react";
import '../../../styles/componentsStyles/ALLOperations.css';
import { newAnnonce } from '../../services/AnnoncesServices/AnnoncesSrv';

function NewAnnonces({ operationId, adminId, onClose, onConfirm }) {

    const [formData, setFormData] = useState({
        Id_Operation: operationId,
        Numero: "",
        Date_Publication: "",
        Journal: "",
        Delai: "",
        Date_Overture: ""
    });

    const [status, setStatus] = useState({
        show: false,
        type: "",
        message: "",
        code: null
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const showStatus = (type, message, code = null) => {
        setStatus({ show: true, type, message, code });

        if (type !== "loading") {
            setTimeout(() => {
                setStatus(prev => ({ ...prev, show: false }));
            }, 4500);
        }
    };

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
            showStatus("error", "Veuillez remplir tous les champs obligatoires.");
            return;
        }

        setIsSubmitting(true);
        showStatus("loading", "Création de l'annonce en cours...");

        try {
            const res = await newAnnonce({...formData, adminId});

            if (res.success) {
                showStatus("success", "Annonce ajoutée avec succès !", res.code);

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
                showStatus("warning", "Cette annonce existe déjà.", 1002);
            }
            else {
                showStatus("error", "Erreur lors de l'ajout de l'annonce.", res.code);
            }

        } catch (err) {
            showStatus("error", "Erreur réseau ou serveur.");
        } finally {
            setIsSubmitting(false);
        }
    };


    const renderStatusPanel = () => {
        if (!status.show) return null;

        let icon = "";
        if (status.type === "success") icon = "✓";
        else if (status.type === "error") icon = "✗";
        else if (status.type === "warning") icon = "⚠";
        else if (status.type === "loading") {
            icon = (
                <span className="status-spinner" style={{ marginRight: 8 }}>
                    <svg width="22" height="22" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="16" stroke="#0078ff" strokeWidth="4" fill="none"
                            strokeDasharray="72" strokeDashoffset="18">
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                repeatCount="indefinite"
                                dur="0.9s"
                                values="0 20 20;360 20 20"
                            />
                        </circle>
                    </svg>
                </span>
            );
        }

        return (
            <div className={`status-panel status-${status.type}`}>
                <div className="status-content">
                    <span className="status-icon">{icon}</span>
                    <span className="status-message">{status.message}</span>

                    {status.code !== null && status.type !== "loading" &&
                        <span className="status-code">Code: {status.code}</span>
                    }
                </div>

                {status.type !== "loading" && (
                    <button className="status-close" onClick={() => setStatus({ ...status, show: false })}>
                        ×
                    </button>
                )}
            </div>
        );
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

                {renderStatusPanel()}
            </div>
        </div>
    );
}

export default NewAnnonces;
