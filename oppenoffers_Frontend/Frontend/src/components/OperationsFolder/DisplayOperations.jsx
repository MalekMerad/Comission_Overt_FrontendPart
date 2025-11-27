import React, { useState, useEffect } from 'react';
import '../../../styles/componentsStyles/ALLOperations.css';
import SearchBar from "../../components/SearchBar";
import { getOperations, deleteoperation } from '../../services/operationService';
import deleteIcon from '../../assets/supprimer.png';
import NewLot from '../LotsFolder/NewLot';
import NewAnnonces from '../AnnoncesFolder/NewAnnonces';
import { useToast } from '../../hooks/useToast';
import { useDisclosure } from '../../hooks/useDisclosure';
import DeleteConfirmation from '../DeleteConfirmation';
import { useAuth } from '../../context/AuthContext';
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
        case 0: return "Terminée";
        case 1: return "Active";
        case -1: return "Supprimée";
        default: return "Inconnu";
    }
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
};

function DisplayOperations() {
    const { isOpen, open, close } = useDisclosure();
    const { user } = useAuth(); // Get user from auth context
    const { showToast } = useToast();
    const { user } = useAuth();
    const [operations, setOperations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [detailsPanelOpenId, setDetailsPanelOpenId] = useState(null);
    const [panelState, setPanelState] = useState(null);
    const [operationToDelete, setOperationToDelete] = useState(null);
    const [lotPanelOpenId, setLotPanelOpenId] = useState(null);
    const [annoncePanelOpenId, setAnnoncePanelOpenId] = useState(null);

    const hasFetchedRef = React.useRef(false);

    useEffect(() => {
        if (hasFetchedRef.current) {
            return;
        }

        const fetchOperations = async () => {
            try {
                setLoading(true);
                const adminID = user?.userId;
                console.log('🔍 Current adminID from AuthContext:', adminID);
                
                if (!adminID) {
                    throw new Error('Admin ID not found. Please login again.');
                }

                const operationsData = await getOperations(adminID);
                console.log('📊 Received operations data:', operationsData);
                
                const mappedOperations = operationsData
                    .filter(op => op.State === 1)
                    .map(op => ({
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
                        VisaDate: formatDate(op.DateVisa)
                    }));
                
                setOperations(mappedOperations);
                hasFetchedRef.current = true; 
                
            } catch (error) {
                console.error('❌ Error in fetchOperations:', error);
                showToast('Erreur lors du chargement des opérations.', 'error');
                setOperations([]);
                hasFetchedRef.current = true;
            } finally {
                setLoading(false);
            }
        };

        if (user?.userId) {
            fetchOperations();
        }
    }, [showToast, user]);

    const handleDeleteRequest = (operation) => {
        setOperationToDelete(operation);
        open();
    };

    const handleConfirmDelete = async () => {
        if (!operationToDelete) return;
        try {
            const response = await deleteoperation(operationToDelete.NumeroDeOperation);
            if (response && response.success) {
                setOperations(prev => prev.filter(op => op.NumeroDeOperation !== operationToDelete.NumeroDeOperation));
                showToast('Opération supprimée avec succès.', 'success');
            } else {
                showToast(response.message || "Échec de la suppression de l'opération", 'error');
            }
        } catch (error) {
            showToast(error.message || "Échec de la suppression de l'opération", 'error');
        } finally {
            close(); 
            setOperationToDelete(null);
        }
    };
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
        showToast('Opération mise à jour avec succès.', 'success');
        setDetailsPanelOpenId(null);
        setPanelState(null);
    };

    const handleOpenLotPanel = (operationId) => setLotPanelOpenId(operationId);
    const handleCloseLotPanel = () => setLotPanelOpenId(null);

    const handleOpenAnnoncePanel = (operationId) => setAnnoncePanelOpenId(operationId);
    const handleCloseAnnoncePanel = () => setAnnoncePanelOpenId(null);

    const filteredData = operations.filter((operation) => {
        const search = searchTerm.trim().toLowerCase();
        if (!search) return true;
        return (
            String(operation.NumeroDeOperation).toLowerCase().includes(search) ||
            String(operation.ServiceDeContract).toLowerCase().includes(search)
        );
    });

    return (
        <div className="DisplayOperations-container">
        <DeleteConfirmation
            isOpen={isOpen} 
            onClose={close}  
            onConfirm={handleConfirmDelete}
            title="Confirmer la suppression"
            message={`Voulez-vous vraiment supprimer l'opération ${operationToDelete?.NumeroDeOperation} ?`}
        />


            {annoncePanelOpenId && (
                <NewAnnonces
                    operationId={annoncePanelOpenId}
                    onClose={handleCloseAnnoncePanel}
                    adminId={user?.userId}
                />
            )}

            {lotPanelOpenId !== null && (
                <NewLot
                    operationId={lotPanelOpenId}
                    adminId={user?.userId}
                    onClose={handleCloseLotPanel}
                />
            )}

            <div style={{ marginBottom: "2rem" }} className="search-container">
                <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    placeholder="Rechercher (numéro ou service)"
                    title="Recherche d'une opération :"
                />

                {searchTerm && (
                    <>
                        <div className="search-results-info">
                            {filteredData.length} opération(s) trouvée(s)
                        </div>
                    </>
                )}
            </div>


            {/* ✅ Liste d’opérations */}
            {loading ? (
                <div style={{ color: "#888", textAlign: 'center', fontStyle: 'italic' }}>
                    Chargement des opérations...
                </div>
            ) : filteredData.length === 0 ? (
                <div style={{ color: "#777", fontStyle: 'italic', textAlign: 'center' }}>
                    Aucune opération trouvée.
                </div>
            ) : (
                filteredData.map((operation) => (
                    <div key={operation.id} className="operation-container">
                        <div className="operation-header">
                            <h2 className="operation-title">
                                Numéro d'opération : {operation.NumeroDeOperation}
                            </h2>
                            <div
                                className="delete-icon-container white"
                                onClick={() => handleDeleteRequest(operation)}
                                title="Supprimer l'opération"
                            >
                                <img
                                    src={deleteIcon}
                                    alt="delete"
                                    className="delete-icon"
                                />
                            </div>
                        </div>


                        <h3 className="operation-service">
                            Service : {operation.ServiceDeContract}
                        </h3>
                        <p className="operation-objectife">{operation.Objectife}</p>

                        <div className="btn-container">
                            <button
                                className="cree-lot-btn"
                                onClick={() => handleOpenLotPanel(operation.id)}
                            >
                                Créer Lot
                            </button>

                            <button className="cree-lot-btn" onClick={() => handleOpenAnnoncePanel(operation.id)}>
                                Créer Annonce
                            </button>

                            <button
                                className="operation-details-btn"
                                onClick={() => handleDetailsClick(operation)}
                            >
                                Détails
                            </button>
                        </div>

                        {detailsPanelOpenId === operation.id && panelState && (
                            <div className="operation-details-modal">
                                <div className="modal-overlay" onClick={handlePanelCancel}></div>
                                <div className="modal-panel">
                                    <div className="modal-header">
                                        <h3>Détails de l'opération</h3>
                                        <button className="modal-close-btn" onClick={handlePanelCancel}>✕</button>
                                    </div>
                                    <div className="modal-content">
                                        <div className="detail-row">
                                            <label>Numéro :</label>
                                            <input type="text" value={panelState.NumeroDeOperation} readOnly />
                                        </div>
                                        <div className="detail-row">
                                            <label>Service :</label>
                                            <input type="text" value={panelState.ServiceDeContract} readOnly />
                                        </div>
                                        <div className="detail-row">
                                            <label>Objectif :</label>
                                            <textarea
                                                value={panelState.Objectife}
                                                onChange={e => handlePanelChange('Objectife', e.target.value)}
                                                rows="5"
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
                                            <input type="text" value={getStateLabel(panelState.State)} readOnly />
                                        </div>
                                        <div className="detail-row">
                                            <label>N° Visa :</label>
                                            <input type="text" value={panelState.VisaNumber} readOnly />
                                        </div>
                                        <div className="detail-row">
                                            <label>Date Visa :</label>
                                            <input type="text" value={panelState.VisaDate} readOnly />
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
