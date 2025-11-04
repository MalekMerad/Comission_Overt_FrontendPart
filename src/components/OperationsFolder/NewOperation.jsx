import { useState } from "react";
import '../../../styles/componentsStyles/NewOperation.css';
import { newOperation } from '../../services/OperationsServices/AddOperationSrv';

function NewOperation(){
    const [typeDeTravau, setTypeDeTravau] = useState('none');
    const [typeDeBudget, setTypeDeBudget] = useState('none');
    const [methodAttribuation, setMethodAttribuation] = useState('none');
    const [currentStep, setCurrentStep] = useState(1);
    const adminID = localStorage.getItem('userID');
    // Form data state
    const [formData, setFormData] = useState({
        NumOperation: '',
        ServContract: '',
        Objectif: '',
        TravalieType: 'none',
        BudgetType: 'none',
        MethodAttribuation: 'none',
        VisaNum: '',
        DateVisa: '',
        adminID:adminID
    });
    
    // Status state
    const [operationStatus, setOperationStatus] = useState({
        show: false,
        type: '', // 'success', 'error', 'warning'
        message: '',
        code: null
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const nextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle radio button changes
    const handleRadioChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Show status panel
    const showStatus = (type, message, code = null) => {
        setOperationStatus({
            show: true,
            type,
            message,
            code
        });
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            setOperationStatus(prev => ({ ...prev, show: false }));
        }, 5000);
    };

    // Handle form submission
    const handleSubmit = async () => {

        console.log("In NewOperation.jsx",adminID);
        // Validate all fields
        const requiredFields = ['NumOperation', 'ServContract', 'Objectif', 'VisaNum', 'DateVisa'];
        const emptyFields = requiredFields.filter(field => !formData[field]);
       
        if (emptyFields.length > 0) {
            showStatus('error', 'Veuillez remplir tous les champs obligatoires.');
            return;
        }

        if (formData.TravalieType === 'none' || formData.BudgetType === 'none' || formData.MethodAttribuation === 'none') {
            showStatus('error', 'Veuillez sélectionner tous les types requis.');
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await newOperation(formData);
            
            if (result.operation) {
                switch (result.operation.code) {
                    case 0:
                        showStatus('success', 'Opération ajoutée avec succès!', 0);
                        setFormData({
                            NumOperation: '',
                            ServContract: '',
                            Objectif: '',
                            TravalieType: 'none',
                            BudgetType: 'none',
                            MethodAttribuation: 'none',
                            VisaNum: '',
                            DateVisa: '',
                            adminID:adminID
                        });
                        setTypeDeTravau('none');
                        setTypeDeBudget('none');
                        setMethodAttribuation('none');
                        setCurrentStep(1);
                        break;
                    case 1001:
                        showStatus('warning', 'Cette opération existe déjà.', 1001);
                        break;
                    case 5000:
                        showStatus('error', 'Une erreur générale est survenue. Veuillez réessayer.', 5000);
                        break;
                    default:
                        showStatus('error', 'Réponse inattendue du serveur.', result.operation.code);
                }
            } else {
                showStatus('error', 'Réponse inattendue du serveur.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            showStatus('error', error.message || 'Erreur lors de l\'ajout de l\'opération.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return(
        <div className="NewOperation-container">
            {/* Status Panel */}
            {operationStatus.show && (
                <div className={`status-panel status-${operationStatus.type}`}>
                    <div className="status-content">
                        <span className="status-icon">
                            {operationStatus.type === 'success' && '✓'}
                            {operationStatus.type === 'error' && '✗'}
                            {operationStatus.type === 'warning' && '⚠'}
                        </span>
                        <span className="status-message">{operationStatus.message}</span>
                        {operationStatus.code !== null && (
                            <span className="status-code">Code: {operationStatus.code}</span>
                        )}
                    </div>
                    <button 
                        className="status-close"
                        onClick={() => setOperationStatus(prev => ({ ...prev, show: false }))}
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="progress-steps">
                <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                    <div className="step-number">1</div>
                    <span>Information de base</span>
                </div>
                <div className="step-connector"></div>
                <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                    <div className="step-number">2</div>
                    <span>Classification et Type</span>
                </div>
                <div className="step-connector"></div>
                <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <span>Marché et Visa</span>
                </div>
            </div>

            {currentStep === 1 && (
                <div className="informations-container step-content">
                    <h1>Information de base</h1>
                    <div className="form-group">
                        <label>Numéro d'opération</label>
                        <input 
                            type="text"
                            name="NumOperation"
                            placeholder="Ex : 2024-00054"
                            value={formData.NumOperation}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Service de passation des marchés</label>
                        <input 
                            type="text"
                            name="ServContract"
                            placeholder="Ex : Direction des Achats"
                            value={formData.ServContract}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Object de l'opération</label>
                        <textarea 
                            rows='10' 
                            cols='50'
                            name="Objectif"
                            placeholder="Ex : Amélioration de l'infrastructure électrique dans la région nord"
                            value={formData.Objectif}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                </div>
            )}

            {currentStep === 2 && (
                <div className="informations-container step-content">
                    <h1>Classification et Type</h1>
                    <div className="form-group">
                        <label>Type de travail</label>
                        <div className="radio-btns-container">
                            <label>
                                <input
                                    type="radio"
                                    name="typeDeTravau"
                                    value="Travaux"
                                    checked={formData.TravalieType === 'Travaux'}
                                    onChange={(e) => {
                                        setTypeDeTravau(e.target.value);
                                        handleRadioChange('TravalieType', e.target.value);
                                    }}
                                />
                                Travaux
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="typeDeTravau"
                                    value="Prestations"
                                    checked={formData.TravalieType === 'Prestations'}
                                    onChange={(e) => {
                                        setTypeDeTravau(e.target.value);
                                        handleRadioChange('TravalieType', e.target.value);
                                    }}
                                />
                                Prestations
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="typeDeTravau"
                                    value="Equipement"
                                    checked={formData.TravalieType === 'Equipement'}
                                    onChange={(e) => {
                                        setTypeDeTravau(e.target.value);
                                        handleRadioChange('TravalieType', e.target.value);
                                    }}
                                />
                                Equipement
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="typeDeTravau"
                                    value="Etude"
                                    checked={formData.TravalieType === 'Etude'}
                                    onChange={(e) => {
                                        setTypeDeTravau(e.target.value);
                                        handleRadioChange('TravalieType', e.target.value);
                                    }}
                                />
                                Etude
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Type de budget</label>
                        <div className="radio-btns-container">
                            <label>
                                <input
                                    type="radio"
                                    name="typeDeBudget"
                                    value="Equipement"
                                    checked={formData.BudgetType === 'Equipement'}
                                    onChange={(e) => {
                                        setTypeDeBudget(e.target.value);
                                        handleRadioChange('BudgetType', e.target.value);
                                    }}
                                />
                                Equipement
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="typeDeBudget"
                                    value="Fonctionnement"
                                    checked={formData.BudgetType === 'Fonctionnement'}
                                    onChange={(e) => {
                                        setTypeDeBudget(e.target.value);
                                        handleRadioChange('BudgetType', e.target.value);
                                    }}
                                />
                                Fonctionnement
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="typeDeBudget"
                                    value="Opérations Hors Budget"
                                    checked={formData.BudgetType === 'Opérations Hors Budget'}
                                    onChange={(e) => {
                                        setTypeDeBudget(e.target.value);
                                        handleRadioChange('BudgetType', e.target.value);
                                    }}
                                />
                                Opérations Hors Budget
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Méthode d'attribution</label>
                        <div className="radio-btns-container">
                            <label>
                                <input
                                    type="radio"
                                    name="methodAttribuation"
                                    value="Appel d'Offres Ouvert"
                                    checked={formData.MethodAttribuation === "Appel d'Offres Ouvert"}
                                    onChange={(e) => {
                                        setMethodAttribuation(e.target.value);
                                        handleRadioChange('MethodAttribuation', e.target.value);
                                    }}
                                />
                                Appel d'Offres Ouvert
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="methodAttribuation"
                                    value="Appel d'Offres Restreint"
                                    checked={formData.MethodAttribuation === "Appel d'Offres Restreint"}
                                    onChange={(e) => {
                                        setMethodAttribuation(e.target.value);
                                        handleRadioChange('MethodAttribuation', e.target.value);
                                    }}
                                />
                                Appel d'Offres Restreint
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {currentStep === 3 && (
                <div className="informations-container step-content">
                    <h1>Marché et Visa</h1>
                    <div className="form-group">
                        <label>Numéro de visa</label>
                        <input 
                            type="text"
                            name="VisaNum"
                            placeholder="Ex : VISA-2024-00128" 
                            value={formData.VisaNum}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Date de visa</label>
                        <input 
                            type='date'
                            name="DateVisa"
                            placeholder="jj/mm/aaaa"
                            value={formData.DateVisa}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            )}

            <div className="navigation-buttons">
                {currentStep > 1 && (
                    <button className="nav-btn prev-btn" onClick={prevStep} disabled={isSubmitting}>
                        Précédent
                    </button>
                )}
                {currentStep < 3 ? (
                    <button className="nav-btn next-btn" onClick={nextStep} disabled={isSubmitting}>
                        Suivant
                    </button>
                ) : (
                    <button 
                        className="submit-btn" 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
                    </button>
                )}
            </div>
        </div>
    )
}

export default NewOperation;