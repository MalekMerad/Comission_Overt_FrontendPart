import React from 'react';
import '../../styles/componentsStyles/DeleteConfirmation.css';

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="delete-modal-overlay">
            <div className="delete-modal-panel">
                <div className="delete-modal-header">
                    <h3>{title}</h3>
                    <button className="delete-modal-close-btn" onClick={onClose}>✕</button>
                </div>
                <div className="delete-modal-content">
                    <p>{message}</p>
                </div>
                <div className="delete-modal-actions">
                    <button className="confirm-delete-btn" onClick={onConfirm}>
                        Confirm
                    </button>
                    <button className="cancel-delete-btn" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmation;
