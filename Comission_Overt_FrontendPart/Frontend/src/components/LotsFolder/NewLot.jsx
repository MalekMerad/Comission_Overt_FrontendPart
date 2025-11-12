import { useState } from 'react';
import '../../../styles/componentsStyles/ALLOperations.css';
import { addNewLotService } from '../../services/LotsServices/LotsSrv';

function NewLot({ operationId, adminId, onClose, onConfirm }) {
    const [numeroLot, setNumeroLot] = useState('');
    const [designation, setDesignation] = useState('');

    console.log("✅ adminId:", adminId);
    console.log("✅ operationId:", operationId);


    const [lotStatus, setLotStatus] = useState({
        show: false,
        type: '',
        message: '',
        code: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const showStatus = (type, message, code = null) => {
        setLotStatus({
            show: true,
            type,
            message,
            code
        });

        if (type !== 'loading') {
            setTimeout(() => {
                setLotStatus(prev => ({ ...prev, show: false }));
            }, 5000);
        }
    };

    const handleSubmit = async () => {
        if (!numeroLot.trim() || !designation.trim()) {
            showStatus('error', 'Veuillez remplir tous les champs obligatoires.');
            return;
        }
        setIsSubmitting(true);
        showStatus('loading', "Ajout du lot en cours ...");

        try {
            const res = await addNewLotService({
                NumeroLot: numeroLot,
                Designation: designation,
                Id_Operation: operationId,
                adminId: adminId             
            });


            if (res.success) {
                showStatus('success', 'Le lot a été ajouté avec succès !', res.code);
                if (onConfirm) onConfirm(res);
                setNumeroLot('');
                setDesignation('');
            } else if (res.code === 1001) {
                showStatus('warning', 'Erreur : Ce lot existe déjà.', 1001);
            } else {
                showStatus('error', "Erreur lors de l'ajout du lot.", res.code);
            }
        } catch (err) {
            showStatus('error', "Erreur du réseau ou du serveur.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (onClose) onClose();
    };

    const renderStatusPanel = () => {
        if (!lotStatus.show) return null;

        // Map newOperation codes to icon types
        let icon = '';
        if (lotStatus.type === 'success') icon = '✓';
        else if (lotStatus.type === 'error') icon = '✗';
        else if (lotStatus.type === 'warning') icon = '⚠';
        else if (lotStatus.type === 'loading') icon = (
            <span className="status-spinner" style={{ marginRight: 8, display: 'inline-block' }}>
                <svg width="22" height="22" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="16" stroke="#0078ff" strokeWidth="4" fill="none" strokeDasharray="72" strokeDashoffset="18">
                        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="0.9s" keyTimes="0;1" values="0 20 20;360 20 20"/>
                    </circle>
                </svg>
            </span>
        );

        // Use same class names as NewOperation.jsx
        return (
            <div className={`status-panel status-${lotStatus.type}`}>
                <div className="status-content">
                    <span className="status-icon">{icon}</span>
                    <span className="status-message">{lotStatus.message}</span>
                    {(lotStatus.code !== null && lotStatus.type !== 'loading') && (
                        <span className="status-code">Code: {lotStatus.code}</span>
                    )}
                </div>
                {lotStatus.type !== 'loading' && (
                    <button
                        className="status-close"
                        onClick={() => setLotStatus(prev => ({ ...prev, show: false }))}
                    >
                        ×
                    </button>
                )}
            </div>
        );
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
                {renderStatusPanel()}
            </div>
        </div>
    );
}

export default NewLot;