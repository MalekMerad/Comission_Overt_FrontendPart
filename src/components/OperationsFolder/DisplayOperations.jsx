import React, { useState, useEffect } from 'react';
import '../../../styles/componentsStyles/DisplayOperation.css'
import { getOperations } from '../../services/OperationsServices/getAllOperationsSrv';
import { deleteOperation } from '../../services/OperationsServices/DeleteOperationSrv';
import deleteIcon from '../../assets/supprimer.png';
import NewLot from '../LotsFolder/NewLot';

const BUDGET_TYPE_OPTIONS = [
    "Equipement",
    "Fonctionnement",
    "Opérations Hors Budget",
];

const MODE_ATTRIB_OPTIONS = [
    "Appel d'Offres Ouvert",
    "Appel d'Offres Restreint"
];

const TYPE_TRAVAU_OPTIONS = [
    "Equipement",
    "Prestations",
    "Etude",
    "Travaux"
];

const getBudgetTypeLabel = (code) => {
    switch (code) {
        case 1: return "Equipement";
        case 2: return "Fonctionnement";
        case 3: return "Opérations Hors Budget";
        default: return "Inconnu";
    }
};

const getModeAttribuationLabel = (code) => {
    switch (code) {
        case 1: return "Appel d'Offres Ouvert";
        case 2: return "Appel d'Offres Restreint";
        default: return "Inconnu";
    }
};

const getTypeTravauxLabel = (code) => {
    switch (code) {
        case 1: return "Travaux";
        case 2: return "Prestations";
        case 3: return "Equipement";
        case 4: return "Etude";
        default: return "Inconnu";
    }
};

const getStateLabel = (code) => {
    switch (code) {
        case 0: return "Temine";
        case 1: return "Active";
        case -1: return "Deleted";
        default: return "Inconnu";
    }
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
};

function DisplayOperations() {
    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [detailsPanelOpenId, setDetailsPanelOpenId] = useState(null);
    const [panelState, setPanelState] = useState(null);
    const [delOperationId, setDelOperationId] = useState(null); 
    const [deleting, setDeleting] = useState(false);
    const [lotPanelOpenId, setLotPanelOpenId] = useState(null);
    const adminID = localStorage.getItem('userID');


    const handleOpenDeleteDialog = (operationId) => {
        setDelOperationId(operationId);
    };

    const handleCancelDelete = () => {
        setDelOperationId(null);
        setDeleting(false);
    };

    const handleConfirmDelete = async () => {
        if (!delOperationId) return;
        setDeleting(true);
        try {
            const response = await deleteOperation(delOperationId);
            if (response && response.success) {
                setOperations((prevOperations) =>
                    prevOperations.filter((op) => op.id !== delOperationId)
                );
                setDelOperationId(null);
            } else {
                alert(response?.message || "Erreur lors de la suppression de l'opération.");
            }
        } catch (error) {
            console.error("Delete operation failed:", error);
            alert("Erreur réseau lors de la suppression de l'opération.");
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        const fetchOperations = async () => {
            try {
                setLoading(true);
                const response = await getOperations(adminID);
                const data = response?.data || [];
                const mappedOperations = data
                    .filter(op => op.State === 1)
                    .map((op) => ({
                        id: op.Id,
                        NumeroDeOperation: op.Numero,
                        ServiceDeContract: op.Service_Contractant,
                        TypeBudget: getBudgetTypeLabel(op.TypeBudget),
                        TypeBudgetCode: op.TypeBudget,
                        ModeAttribuation: getModeAttribuationLabel(op.ModeAttribuation),
                        ModeAttribuationCode: op.ModeAttribuation,
                        Objectife: op.Objet,
                        TypeTravau: getTypeTravauxLabel(op.TypeTravaux),
                        TypeTravauxCode: op.TypeTravaux,
                        State: getStateLabel(op.State),
                        StateCode: op.State,
                        VisaNumber: op.NumeroVisa,
                        VisaDate: formatDate(op.DateVisa),
                        adminId: op.adminId
                    }));
                setOperations(mappedOperations);
            } catch (error) {
                console.error("Failed to fetch operations:", error);
                setOperations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOperations();
    }, [adminID]);

    const buildPanelState = (op) => ({
        NumeroDeOperation: op.NumeroDeOperation || "",
        ServiceDeContract: op.ServiceDeContract || "",
        TypeBudget: op.TypeBudgetCode || "",
        ModeAttribuation: op.ModeAttribuationCode || "",
        Objectife: op.Objectife || "",
        TypeTravau: op.TypeTravauxCode || "",
        State: op.StateCode || "",
        VisaNumber: op.VisaNumber || "",
        VisaDate: op.VisaDate || ""
    });

    const filteredData = operations.filter((operation) => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        if (!normalizedSearch) return true;
        const num = operation.NumeroDeOperation?.toLowerCase() || "";
        const service = operation.ServiceDeContract?.toLowerCase() || "";
        return (
            num.includes(normalizedSearch) ||
            service.includes(normalizedSearch)
        );
    });

    const handleDetailsClick = (operation) => {
        setDetailsPanelOpenId(operation.id);
        setPanelState(buildPanelState(operation));
    };

    const handlePanelChange = (field, value) => {
        setPanelState(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePanelCancel = () => {
        setDetailsPanelOpenId(null);
        setPanelState(null);
    };

    const handlePanelUpdate = () => {
        setDetailsPanelOpenId(null);
        setPanelState(null);
    };

    const handleOpenLotPanel = (operationId) => {
        setLotPanelOpenId(operationId);
    };

    const handleCloseLotPanel = () => {
        setLotPanelOpenId(null);
    };

    return (
        <div className="DisplayOperations-container">
            {(detailsPanelOpenId || delOperationId || lotPanelOpenId) && (
                <div className="panel-backdrop"></div>
            )}
    
            {delOperationId !== null && (
                <div className="delete-confirm-modal">
                    <div className="delete-confirm-panel">
                        <div className="delete-confirm-header">
                            <img src={deleteIcon} alt="delete-icon" className='delete-icon-large' />
                        </div>
                        <div className="delete-confirm-content">
                            <h3>Confirmer la suppression</h3>
                            <p>Voulez-vous vraiment supprimer cette opération ?</p>
                        </div>
                        <div className="delete-confirm-actions">
                            <button
                                className="cancel-delete-btn"
                                onClick={handleCancelDelete}
                                disabled={deleting}
                            >Annuler</button>
                            <button
                                className="confirm-delete-btn"
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                                style={{ background: '#e44', color: "white"}}
                            >
                                {deleting ? "Suppression..." : "Supprimer"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
    
            {lotPanelOpenId && (
                <NewLot 
                    operationId={lotPanelOpenId} 
                    onClose={handleCloseLotPanel} 
                />
            )}
    
            {/* Search section */}
            <div style={{ marginBottom: "2rem" }} className='search-container'>
                <label className="search-label">Recherche d'une opération</label>
                <div className="search-wrapper">
                    <input
                        type="text"
                        className="operations-search-bar"
                        placeholder="Rechercher Service, Numéro d'opération"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            className={`search-clear ${searchTerm ? 'visible' : ''}`}
                            onClick={() => setSearchTerm('')}
                            type="button">✕</button>
                    )}
                    <div className="search-loading"></div>
                    <div className="search-focus-effect"></div>
                </div>
                {searchTerm && (
                    <div className={`search-results-info ${searchTerm ? 'visible' : ''}`}>
                        {filteredData.length} opération(s) trouvée(s)
                    </div>
                )}
            </div>
            {loading ? (
                <div style={{ color: "#888", textAlign: 'center', fontStyle: 'italic' }}>
                    Chargement des opérations...
                </div>
            ) : filteredData.length === 0 ? (
                <div style={{ color: "#777", fontStyle: 'italic', textAlign: 'center' }}>
                    Aucun résultat trouvé.
                </div>
            ) : (
                filteredData.map((operation) => (
                    <div key={operation.id} className="operation-container">
                        <div className='operation-header'>
                            <h2 className="operation-title">Numero d'operation: {operation.NumeroDeOperation}</h2>
                            <div className='delete-icon-container'>
                                <img
                                    src={deleteIcon}
                                    alt="delete-icon"
                                    className='delete-icon'
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleOpenDeleteDialog(operation.id)}
                                    title="Supprimer l'opération"
                                />
                            </div>
                        </div>
                        <h3 className="operation-service">Service: {operation.ServiceDeContract}</h3>
                        <p className="operation-objectife">{operation.Objectife}</p>
                        <div className='btn-container'>
                            <button
                                className="cree-lot-btn"
                                onClick={() => handleOpenLotPanel(operation.id)}
                            >
                                Créer Lot
                            </button>
                            <button
                                className="operation-details-btn"
                                onClick={() => handleDetailsClick(operation)}
                            >
                                Operation details
                            </button>
                        </div>
    
                        {detailsPanelOpenId === operation.id && panelState && (
                            <div className="operation-details-modal">
                                <div className="modal-overlay" onClick={handlePanelCancel}></div>
                                <div className="modal-panel">
                                    <div className="modal-header">
                                        <h3>Détail de l'opération</h3>
                                        <button className="modal-close-btn" onClick={handlePanelCancel}>✕</button>
                                    </div>
                                    <div className="modal-content">
                                        <div className="detail-row">
                                            <label>Numéro d'opération :</label>
                                            <input
                                                type="text"
                                                value={panelState.NumeroDeOperation}
                                                readOnly
                                            />
                                        </div>
                                        <div className="detail-row">
                                            <label>Service de contractant :</label>
                                            <input
                                                type="text"
                                                value={panelState.ServiceDeContract}
                                                readOnly
                                            />
                                        </div>
                                        <div className="detail-row">
                                            <label>Object: </label>
                                            <textarea
                                                value={panelState.Objectife}
                                                onChange={e => handlePanelChange('Objectife', e.target.value)}
                                                rows='7' cols='10'
                                            />
                                        </div>
                                        <div className="detail-row">
                                            <label>Type de budget :</label>
                                            <select
                                                value={panelState.TypeBudget}
                                                onChange={e => handlePanelChange('TypeBudget', e.target.value)}
                                            >
                                                <option value={1}>Equipement</option>
                                                <option value={2}>Fonctionnement</option>
                                                <option value={3}>Opérations Hors Budget</option>
                                            </select>
                                        </div>
                                        <div className="detail-row">
                                            <label>Mode d'attribution :</label>
                                            <select
                                                value={panelState.ModeAttribuation}
                                                onChange={e => handlePanelChange('ModeAttribuation', e.target.value)}
                                            >
                                                <option value={1}>Appel d'Offres Ouvert</option>
                                                <option value={2}>Appel d'Offres Restreint</option>
                                            </select>
                                        </div>
                                        <div className="detail-row">
                                            <label>Type de travaux :</label>
                                            <select
                                                value={panelState.TypeTravau}
                                                onChange={e => handlePanelChange('TypeTravau', e.target.value)}
                                            >
                                                <option value={1}>Travaux</option>
                                                <option value={2}>Prestations</option>
                                                <option value={3}>Equipement</option>
                                                <option value={4}>Etude</option>
                                            </select>
                                        </div>
                                        <div className="detail-row">
                                            <label>État :</label>
                                            <input
                                                type="text"
                                                value={getStateLabel(panelState.State)}
                                                readOnly
                                            />
                                        </div>
                                        <div className="detail-row">
                                            <label>N° Visa :</label>
                                            <input
                                                type="text"
                                                value={panelState.VisaNumber}
                                                readOnly
                                            />
                                        </div>
                                        <div className="detail-row">
                                            <label>Date Visa :</label>
                                            <input
                                                type="text"
                                                value={panelState.VisaDate}
                                                readOnly
                                            />
                                        </div>
                                        <div className="modal-actions">
                                            <button className="update-operation-btn" onClick={handlePanelUpdate}>Mettre à jour</button>
                                            <button className="cancel-operation-btn" onClick={handlePanelCancel}>Annuler</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}


export default DisplayOperations;