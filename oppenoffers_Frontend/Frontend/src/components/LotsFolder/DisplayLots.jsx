import { useEffect, useMemo, useState } from "react";
import "../../../styles/componentsStyles/DisplayLots.css";
import "../../../styles/BtnClose.css";
import {
    getAllLotsService,
    deleteLotService,
    updateLotService,
} from "../../services/lotService";
import deleteIcon from "../../assets/supprimer.png";
import { useToast } from "../../hooks/useToast";
import { useDisclosure } from "../../hooks/useDisclosure";
import DeleteConfirmation from "../DeleteConfirmation";
import { useAuth } from "../../context/AuthContext";
import TextInput from "../FormElements/TextInput";
import TextArea from "../FormElements/TextArea";

function groupLotsByOperation(lots = []) {
    const operationsMap = {};

    lots.forEach((lot) => {
        const operationId = lot.id_Operation;
        if (!operationId) {
            return;
        }

        if (!operationsMap[operationId]) {
            operationsMap[operationId] = {
                operationId,
                operationNumero:
                    lot.OperationNumero ??
                    lot.operationNumero ??
                    lot.OperationNumeroLot ??
                    "—",
                lots: [],
            };
        }

        operationsMap[operationId].lots.push({
            id: lot.id,
            numeroLot:
                lot.NumeroLot ??
                lot.NumerLot ??
                lot.numeroLot ??
                lot.numLot ??
                "—",
            designation: lot.Designation ?? lot.designation ?? "—",
            operationId,
            operationNumero: operationsMap[operationId].operationNumero,
            raw: lot,
        });
    });

    return Object.values(operationsMap);
}

export default function DisplayLots() {
    const { showToast } = useToast();
    const { isOpen: isDeleteModalOpen, open: openDeleteModal, close: closeDeleteModal } = useDisclosure();
    const [openOperationId, setOpenOperationId] = useState(null);
    const [operationsWithLots, setOperationsWithLots] = useState([]);
    const [selectedLot, setSelectedLot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lotToDelete, setLotToDelete] = useState(null);
    const [updating, setUpdating] = useState(false);

    const [newDesignation, setNewDesignation] = useState("");

    const {user} = useAuth();
    const adminID = user?.userId;

    useEffect(() => {
        async function fetchLots() {
            setLoading(true);
    
            try {
                const response = await getAllLotsService(adminID);
                if (response && response.success && Array.isArray(response.data)) {
                    setOperationsWithLots(groupLotsByOperation(response.data));
                } else {
                    showToast(response.message || "Échec du chargement des lots.", 'error');
                    setOperationsWithLots([]);
                }
            } catch (err) {
                showToast(err.message || "Erreur inconnue lors du chargement des lots.", 'error');
                setOperationsWithLots([]);
            } finally {
                setLoading(false);
            }
        }
        if (adminID) {
            fetchLots();
        } else {
            showToast("Identifiant administrateur introuvable.", 'error');
        }
    }, [adminID]);

    const handleVoirClick = (operationId) => {
        setOpenOperationId(operationId);
        setTimeout(() => {
            document
                .getElementById(`operation-header-${operationId}`)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };



    const handleCloseList = (operationId) => {
        setOpenOperationId(null);
        document
            .getElementById(`operation-header-${operationId}`)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleOpenLotDetails = (lot) => {
        setSelectedLot(lot);
        setNewDesignation(lot.designation ?? "");
    };

    const handleCloseLotDetails = () => {
        setSelectedLot(null);
        setNewDesignation("");
    };

    const handleDeleteRequest = (lot) => {
        console.log("Full lot object:", lot);
        console.log("Lot ID:", lot.id);
        console.log("All lot properties:", Object.keys(lot));
        setLotToDelete(lot);
        openDeleteModal();
    };

    const handleConfirmDelete = async () => {
        if (!lotToDelete) return;
        try {
            const response = await deleteLotService(lotToDelete.id);
            if (response && response.success) {
                setOperationsWithLots((prev) => {
                    return prev
                        .map((operation) => {
                            if (operation.operationId !== lotToDelete.operationId)
                                return operation;
                            return {
                                ...operation,
                                lots: operation.lots.filter(
                                    (lot) => lot.id !== lotToDelete.id
                                ),
                            };
                        })
                        .filter((operation) => operation);
                });
                showToast("Lot supprimé avec succès.", 'success');
                setSelectedLot((current) =>
                    current && current.id === lotToDelete.id ? null : current
                );
            } else {
                showToast((response && response.message) || "Échec de la suppression du lot", 'error');
            }
        } catch (lotError) {
            showToast(lotError?.message || "Erreur lors de la suppression du lot", 'error');
        } finally {
            closeDeleteModal();
            setLotToDelete(null);
        }
    };

    const handleSubmitLotUpdate = async () => {
        if (!selectedLot?.id) {
            showToast("Lot introuvable.", 'error');
            return;
        }

        const trimmedDesignation = newDesignation.trim();

        if (!trimmedDesignation) {
            showToast("La désignation ne peut pas être vide.", 'error');
            return;
        }

        if (trimmedDesignation === (selectedLot.designation ?? "").trim()) {
            showToast("Aucune modification détectée.", 'info');
            return;
        }

        setUpdating(true);

        try {
            const response = await updateLotService(
                selectedLot.id,
                trimmedDesignation
            );

            if (response?.success) {
                setOperationsWithLots((prevOperations) =>
                    prevOperations.map((operation) => {
                        if (
                            operation.operationId !== selectedLot.operationId
                        ) {
                            return operation;
                        }

                        return {
                            ...operation,
                            lots: operation.lots.map((lot) =>
                                lot.id === selectedLot.id
                                    ? {
                                        ...lot,
                                        designation: trimmedDesignation,
                                    }
                                    : lot
                            ),
                        };
                    })
                );

                setSelectedLot((current) =>
                    current
                        ? { ...current, designation: trimmedDesignation }
                        : current
                );
                setNewDesignation(trimmedDesignation);
                showToast("Désignation mise à jour avec succès.", 'success');
            } else {
                showToast(response?.message || "Échec de la mise à jour de la désignation.", 'error');
            }
        } catch (updateErrorCaught) {
            showToast(updateErrorCaught?.message || "Erreur lors de la mise à jour du lot.", 'error');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="DisplayLots-container">
            <DeleteConfirmation
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Confirmer la suppression"
                message={`Voulez-vous vraiment supprimer le lot ${lotToDelete?.numeroLot} ?`}
            />

            {selectedLot && (
                <div
                    className="lot-details-overlay"
                    onClick={handleCloseLotDetails}
                    role="presentation"
                >
                    <div
                        className="lot-details-box"
                        onClick={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        <h2>Détails du lot</h2>
                        <button className="modal-close-btn" onClick={handleCloseLotDetails}>✕</button>
                        
                        <div className="lot-details-grid">
                            <TextInput
                                label="Numéro du lot"
                                value={selectedLot?.numeroLot ?? "—"}
                                readOnly
                            />
                            <TextArea
                                label="Désignation"
                                value={newDesignation}
                                onChange={(event) => {
                                    setNewDesignation(event.target.value);
                                }}
                                cols="10"
                                rows="5"
                            />
                        </div>

                        <div className="lot-details-buttons">
                            <button
                                className="save-btn"
                                type="button"
                                onClick={handleSubmitLotUpdate}
                                disabled={updating}
                            >
                                {updating ? "Sauvegarde..." : "Mettre à jour"}
                            </button>
                            <button
                                className="cancel-btn"
                                type="button"
                                onClick={handleCloseLotDetails}
                            >
                                Fermer
                            </button>
                            
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="lots-loading">Chargement des lots...</div>
            )}
            {!loading && operationsWithLots.length === 0 && (
                <div className="lots-empty">
                    <div className="lots-empty-icon">📝</div>
                        <div style={{ color: "#777", fontStyle: 'italic', textAlign: 'center' }}>
                            Aucune opération trouvée.
                        </div>
                </div>
            )}
            {!loading &&
                operationsWithLots.map((operation) => (
                    <div
                        className="operation-card"
                        key={operation.operationId}
                    >
                        <div
                            id={`operation-header-${operation.operationId}`}
                            className="operation-header"
                        >
                            <span className="operation-number">
                                Operation N°: {operation.operationNumero}
                                <span className="lots-count">
                                    {operation.lots.length}
                                </span>
                            </span>
                        </div>
                        <div className="lots-dropdown">
                            <div className="lots-content">
                                {operation.lots.length > 0 ? (
                                    <>
                                        <div className="lots-grid">
                                            {operation.lots.map((lot, index) => {
                                                console.log("Lot in map:", lot);
                                                return (
                                                    <div
                                                        key={lot.id ?? index}
                                                        className="lot-item"
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={() => handleOpenLotDetails(lot)}
                                                        onKeyDown={event => {
                                                            if (event.key === "Enter" || event.key === " ") {
                                                                event.preventDefault();
                                                                handleOpenLotDetails(lot);
                                                            }
                                                        }}
                                                    >
                                                        <div className="lot-header">
                                                            <div className="lot-number">
                                                                {lot.numeroLot}
                                                            </div>
                                                            <div className="delete-lot-btn-container">
                                                                <button
                                                                    className="delete-lot-btn"
                                                                    type="button"
                                                                    title="Supprimer le lot"
                                                                    onClick={event => {
                                                                        event.stopPropagation();
                                                                        handleDeleteRequest(lot);
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={deleteIcon}
                                                                        alt="Supprimer"
                                                                        className="delete-icon-img"
                                                                    />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <p className="lot-designation">{lot.designation}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                ) : (
                                    <div className="lots-empty">
                                        <div className="lots-empty-icon">
                                            📝
                                        </div>
                                        <p className="lots-empty-text">
                                            Aucun lot disponible pour cette
                                            opération
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
}