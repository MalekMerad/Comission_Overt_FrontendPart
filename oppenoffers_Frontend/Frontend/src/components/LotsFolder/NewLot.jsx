import { useState } from 'react';
import '../../../styles/componentsStyles/ALLOperations.css';
import { addNewLotService } from '../../services/lotService';
import { useToast } from '../../hooks/useToast';

function NewLot({ operationId, adminId, onClose, onConfirm }) {
    const { showToast } = useToast();
    const [numeroLot, setNumeroLot] = useState('');
    const [designation, setDesignation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!numeroLot.trim() || !designation.trim()) {
            showToast('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }
        setIsSubmitting(true);

        try {
            const res = await addNewLotService({
                NumeroLot: numeroLot,
                Designation: designation,
                id_Operation: operationId,
                adminId: adminId
            });

            if (res.success) {
                showToast('Le lot a été ajouté avec succès !', 'success');
                if (onConfirm) onConfirm(res);
                setNumeroLot('');
                setDesignation('');
            } else if (res.code === 1001) {
                showToast('Erreur : Ce lot existe déjà.', 'warning');
            } else {
                showToast("Erreur lors de l'ajout du lot.", 'error');
            }
        } catch (err) {
            if (err.validationError) {
                err.validationError.forEach(error => showToast(error, "error"));
            } else {
                showToast('Erreur du réseau ou du serveur.', 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (onClose) onClose();
    };

    return (
        <div className="operation-details-modal">
            <div className="modal-overlay" onClick={handleCancel}></div>
            <div className="modal-panel">
                <div className="modal-header">
                    <h3>Insérer les details de cette Lot</h3>
                    <button className="modal-close-btn" onClick={handleCancel}>✕</button>
                </div>
                <div className="modal-content">
                    <div className="detail-row">
                        <label>Numéro de Lot :</label>
                        <input
                            type='text'
                            placeholder="Ex : 2024-00054"
                            value={numeroLot}
                            onChange={e => setNumeroLot(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="detail-row">
                        <label>Designation :</label>
                        <textarea
                            rows='6'
                            placeholder="Ex : Amélioration de l'infrastructure électrique dans la région nord"
                            value={designation}
                            onChange={e => setDesignation(e.target.value)}
                            disabled={isSubmitting}
                        ></textarea>
                    </div>
                    <div className="modal-actions">
                        <button
                            className="update-operation-btn"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !numeroLot || !designation}
                        >
                            {isSubmitting ? "Envoi en cours..." : "Créer Lot"}
                        </button>
                        <button
                            className="cancel-operation-btn"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewLot;