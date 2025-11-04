import { useState, useEffect } from "react";
import '../../../styles/componentsStyles/DisplayLots.css';
import { getAllLots } from "../../services/LotServices/getAllLotsSrv";


function groupLotsByOperation(lots = []) {
    const operationsMap = {};
    lots.forEach(lot => {
        const operationId = lot.id_Operation; 
        if (!operationsMap[operationId]) {
            operationsMap[operationId] = {
                operationId: operationId,
                operationNumero: lot.OperationNumero,
                lots: []
            };
        }
        operationsMap[operationId].lots.push({
            id: lot.id,
            numeroLot: lot.NumerLot,
            designation: lot.Designation,
        });
    });
    return Object.values(operationsMap);
}

export default function DisplayLots() {
    const [openOperationId, setOpenOperationId] = useState(null);
    const [operationsWithLots, setOperationsWithLots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const adminID = localStorage.getItem('userID');

    useEffect(() => {
        async function fetchLots() {
            setLoading(true);
            setError(null);
            try {
                const response = await getAllLots(adminID);
                if (response && response.success && Array.isArray(response.data)) {
                    setOperationsWithLots(groupLotsByOperation(response.data));
                } else {
                    setError(response.message || "Échec du chargement des lots.");
                    setOperationsWithLots([]);
                }
            } catch (err) {
                setError(err.message);
                setOperationsWithLots([]);
            } finally {
                setLoading(false);
            }
        }
        fetchLots();
    }, [adminID]);

    const handleVoirClick = (operationId) => {
        setOpenOperationId(operationId);
        setTimeout(() => {
            document.getElementById(`operation-header-${operationId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };

    const handleCloseList = (operationId) => {
        setOpenOperationId(null);
        document.getElementById(`operation-header-${operationId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="DisplayLots-container">
            {loading && (
                <div className="lots-loading">
                    Chargement des lots...
                </div>
            )}
            {error && (
                <div className="lots-error">
                    Erreur : {error}
                </div>
            )}
            {!loading && !error && operationsWithLots.length === 0 && (
                <div className="lots-empty">
                    <div className="lots-empty-icon">📝</div>
                    <p className="lots-empty-text">Aucune opération avec lots trouvée.</p>
                </div>
            )}
            {!loading && !error && operationsWithLots.map(operation => (
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
                            onClick={() => handleVoirClick(operation.operationId)}
                            disabled={openOperationId === operation.operationId}
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
                                            {operation.lots.map(lot => (
                                                <div
                                                    key={lot.lotNumber}
                                                    className="lot-item"
                                                >
                                                    <div className="lot-number">
                                                        {lot.numeroLot}
                                                    </div>
                                                    <p className="lot-designation">
                                                        {lot.designation}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="lots-actions">
                                            <button
                                                className="fermer-liste-btn"
                                                onClick={() => handleCloseList(operation.operationId)}
                                            >
                                                Fermer la liste
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="lots-empty">
                                        <div className="lots-empty-icon">📝</div>
                                        <p className="lots-empty-text">Aucun lot disponible pour cette opération</p>
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