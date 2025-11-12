import { useEffect, useMemo, useState } from "react";
import "../../../styles/componentsStyles/DisplayLots.css";
import {
    getAllLotsService,
    deleteLotService,
    updateLotService,
} from "../../services/LotsServices/LotsSrv";
import deleteIcon from "../../assets/supprimer.png";

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
    const [openOperationId, setOpenOperationId] = useState(null);
    const [operationsWithLots, setOperationsWithLots] = useState([]);
    const [selectedLot, setSelectedLot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Delete modal/confirm state for lots
    const [delLotId, setDelLotId] = useState(null);
    const [delLotOperationId, setDelLotOperationId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(null);

    const [newDesignation, setNewDesignation] = useState("");

    const adminID = useMemo(() => localStorage.getItem("userID"), []);

    useEffect(() => {
        async function fetchLots() {
            setLoading(true);
            setError(null);

            try {
                const response = await getAllLotsService();
                if (response && response.success && Array.isArray(response.data)) {
                    setOperationsWithLots(groupLotsByOperation(response.data));
                } else {
                    setError(
                        response && response.message
                            ? response.message
                            : "Échec du chargement des lots."
                    );
                    setOperationsWithLots([]);
                }
            } catch (err) {
                setError(
                    err && err.message
                        ? err.message
                        : "Erreur inconnue lors du chargement des lots."
                );
                setOperationsWithLots([]);
            } finally {
                setLoading(false);
            }
        }

        if (adminID) {
            fetchLots();
        } else {
            setError("Identifiant administrateur introuvable.");
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
        setUpdateError(null);
        setUpdateSuccess(null);
    };

    const handleCloseLotDetails = () => {
        setSelectedLot(null);
        setNewDesignation("");
        setUpdateError(null);
        setUpdateSuccess(null);
    };

    const handleOpenDeleteDialog = (lotId, operationId) => {
        setDelLotId(lotId);
        setDelLotOperationId(operationId);
    };

    const handleCancelDelete = () => {
        setDelLotId(null);
        setDelLotOperationId(null);
        setDeleting(false);
    };

    const handleConfirmDelete = async () => {
        if (!delLotId) return;
        setDeleting(true);
        try {
            const response = await deleteLotService(delLotId);
            if (response && response.success) {
                setOperationsWithLots((prev) => {
                    return prev
                        .map((operation) => {
                            if (operation.operationId !== delLotOperationId)
                                return operation;
                            return {
                                ...operation,
                                lots: operation.lots.filter(
                                    (lot) => lot.id !== delLotId
                                ),
                            };
                        })
                        .filter((operation) => operation);
                });
                setSelectedLot((current) =>
                    current && current.id === delLotId ? null : current
                );
                setDelLotId(null);
                setDelLotOperationId(null);
            } else {
                setError(
                    (response && response.message) ||
                        "Échec de la suppression du lot"
                );
            }
        } catch (lotError) {
            setError(
                lotError?.message || "Erreur lors de la suppression du lot"
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleSubmitLotUpdate = async () => {
        if (!selectedLot?.id) {
            setUpdateError("Lot introuvable.");
            return;
        }

        const trimmedDesignation = newDesignation.trim();

        if (!trimmedDesignation) {
            setUpdateError("La désignation ne peut pas être vide.");
            return;
        }

        if (trimmedDesignation === (selectedLot.designation ?? "").trim()) {
            setUpdateSuccess("Aucune modification détectée.");
            setUpdateError(null);
            return;
        }

        setUpdating(true);
        setUpdateError(null);
        setUpdateSuccess(null);

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
                setUpdateSuccess("Désignation mise à jour avec succès.");
            } else {
                setUpdateError(
                    response?.message ||
                        "Échec de la mise à jour de la désignation."
                );
            }
        } catch (updateErrorCaught) {
            setUpdateError(
                updateErrorCaught?.message ||
                    "Erreur lors de la mise à jour du lot."
            );
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="DisplayLots-container">
            {delLotId !== null && (
                <div
                    className="confirm-overlay"
                    onClick={handleCancelDelete}
                    role="presentation"
                >
                    <div
                        className="confirm-box"
                        onClick={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="confirm-header">
                            <div className="confirm-icon">⚠️</div>
                            <h3 className="confirm-title">
                                Confirmer la suppression
                            </h3>
                        </div>
                        <p className="confirm-text">
                            Voulez-vous vraiment supprimer ce lot ?
                        </p>
                        <div className="confirm-buttons">
                            <button
                                className="confirm-cancel"
                                onClick={handleCancelDelete}
                                disabled={deleting}
                                type="button"
                            >
                                Annuler
                            </button>
                            <button
                                className="confirm-yes"
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                                type="button"
                            >
                                {deleting ? "Suppression..." : "Supprimer"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                        <div className="lot-details-grid">
                            <label>
                                <span>Numéro du lot</span>
                                <input
                                    value={selectedLot?.numeroLot ?? "—"}
                                    readOnly
                                />
                            </label>
                            <label>
                                <span>Désignation</span>
                                <textarea
                                    value={newDesignation}
                                    onChange={(event) => {
                                        setNewDesignation(event.target.value);
                                        setUpdateError(null);
                                        setUpdateSuccess(null);
                                    }}
                                    cols="10"
                                    rows="5"
                                />
                            </label>
                        </div>

                        {updateError && (
                            <div className="error-message">{updateError}</div>
                        )}
                        {updateSuccess && (
                            <div className="success-message">
                                {updateSuccess}
                            </div>
                        )}

                        <div className="lot-details-buttons">
                            <button
                                className="cancel-btn"
                                type="button"
                                onClick={handleCloseLotDetails}
                            >
                                Fermer
                            </button>
                            <button
                                className="save-btn"
                                type="button"
                                onClick={handleSubmitLotUpdate}
                                disabled={updating}
                            >
                                {updating ? "Sauvegarde..." : "Mettre à jour"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="lots-loading">Chargement des lots...</div>
            )}
            {error && (
                <div className="error-message">Erreur : {error}</div>
            )}
            {!loading && !error && operationsWithLots.length === 0 && (
                <div className="lots-empty">
                    <div className="lots-empty-icon">📝</div>
                    <p className="lots-empty-text">
                        Aucune opération avec lots trouvée.
                    </p>
                </div>
            )}
            {!loading &&
                !error &&
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
                            <button
                                className="voir-lots-btn"
                                onClick={() =>
                                    handleVoirClick(operation.operationId)
                                }
                                disabled={
                                    openOperationId === operation.operationId
                                }
                                type="button"
                            >
                                Voir liste de lot
                            </button>
                        </div>
                        {openOperationId === operation.operationId && (
                            <div className="lots-dropdown">
                                <div className="lots-content">
                                    {operation.lots.length > 0 ? (
                                        <>
                                            <div className="lots-grid">
                                                {operation.lots.map((lot, index) => {
                                                    const isDeleting = deleting && delLotId === lot.id;
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
                                                                    disabled={isDeleting}
                                                                    onClick={event => {
                                                                        event.stopPropagation();
                                                                        handleOpenDeleteDialog(lot.id, operation.operationId);
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
                                            <div className="lots-actions">
                                                <button
                                                    className="fermer-liste-btn"
                                                    onClick={() =>
                                                        handleCloseList(
                                                            operation.operationId
                                                        )
                                                    }
                                                    type="button"
                                                >
                                                    Fermer la liste
                                                </button>
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
                        )}
                    </div>
                ))}
        </div>
    );
}