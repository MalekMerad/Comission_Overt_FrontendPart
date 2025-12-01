import { useState } from "react";
import '../../../styles/componentsStyles/NewOperation.css';
import { newOperation } from '../../services/operationService';
import { useToast } from '../../hooks/useToast';
import { useAuth } from "../../context/AuthContext";
import TextInput from "../FormElements/TextInput";
import TextArea from "../FormElements/TextArea";

function NewOperation() {
    const { showToast } = useToast();
    const [typeDeTravau, setTypeDeTravau] = useState('none');
    const [typeDeBudget, setTypeDeBudget] = useState('none');
    const [methodAttribuation, setMethodAttribuation] = useState('none');
    const [currentStep, setCurrentStep] = useState(1);
    const {user} = useAuth();

    const [formData, setFormData] = useState({
        NumOperation: '',
        ServContract: '',
        Objectif: '',
        TravalieType: 'none',
        BudgetType: 'none',
        MethodAttribuation: 'none',
        VisaNum: '',
        DateVisa: '',
        adminID: user?.userId
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRadioChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        const requiredFields = ['NumOperation', 'ServContract', 'Objectif', 'VisaNum', 'DateVisa'];
        const emptyFields = requiredFields.filter(field => !formData[field]);

        if (emptyFields.length > 0) {
            showToast('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        if (formData.TravalieType === 'none' || formData.BudgetType === 'none' || formData.MethodAttribuation === 'none') {
            showToast('Veuillez sélectionner tous les types requis.', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await newOperation({
                ...formData,
                adminId: user?.userId
            });

            if (result && typeof result.code !== 'undefined') {
                switch (result.code) {
                    case 0:
                        showToast('Opération ajoutée avec succès!', 'success');
                        setFormData({
                            NumOperation: '',
                            ServContract: '',
                            Objectif: '',
                            TravalieType: 'none',
                            BudgetType: 'none',
                            MethodAttribuation: 'none',
                            VisaNum: '',
                            DateVisa: '',
                            adminID: user.userId
                        });
                        setTypeDeTravau('none');
                        setTypeDeBudget('none');
                        setMethodAttribuation('none');
                        setCurrentStep(1);
                        break;

                    case 1001:
                        showToast('Cette opération existe déjà.', 'warning');
                        break;

                    case 5000:
                        showToast('Une erreur générale est survenue. Veuillez réessayer.', 'error');
                        break;

                    default:
                        showToast('Réponse inattendue du serveur.', 'error');
                }
            } else {
                showToast('Réponse inattendue du serveur (aucun code retourné).', 'error');
            }

        } catch (error) {
            if (error.validationError) {
                error.validationError.forEach(err => showToast(err, 'error'));
            } else {
                showToast(error.message || "Erreur lors de l'ajout de l'opération.", 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="NewOperation-container">
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
                        <TextInput
                            label="Numéro d'opération"
                            name="NumOperation"
                            placeholder="Ex : 2024-00054"
                            value={formData.NumOperation}
                            onChange={handleInputChange}
                        />
                        <TextInput
                            label="Service de passation des marchés"
                            name="ServContract"
                            placeholder="Ex : Direction des Achats"
                            value={formData.ServContract}
                            onChange={handleInputChange}
                        />
                        <TextArea
                            label="Objectif de l'opération"
                            name="Objectif"
                            placeholder="Ex : Amélioration de l'infrastructure électrique dans la région nord"
                            value={formData.Objectif}
                            onChange={handleInputChange}
                        />
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
                        <TextInput
                            label="Numéro de visa"
                            name="VisaNum"
                            placeholder="Ex : VISA-2024-00128"
                            value={formData.VisaNum}
                            onChange={handleInputChange}
                        />
                        <TextInput
                            label="Date de visa"
                            type='date'
                            name="DateVisa"
                            placeholder="jj/mm/aaaa"
                            value={formData.DateVisa}
                            onChange={handleInputChange}
                        />
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