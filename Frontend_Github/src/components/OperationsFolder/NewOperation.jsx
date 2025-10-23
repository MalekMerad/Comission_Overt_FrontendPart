import { useState } from "react";
import '../../../styles/componentsStyles/NewOperation.css';

function NewOperation(){
    const [typeDeTravau, setTypeDeTravau] = useState('none');
    const [typeDeBudget, setTypeDeBudget] = useState('none');
    const [methodAttribuation, setMethodAttribuation] = useState('none');
    const [currentStep, setCurrentStep] = useState(1);

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

    return(
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
                    <div className="form-group">
                        <label>Numéro d'opération</label>
                        <input type="text"/>
                    </div>
                    <div className="form-group">
                        <label>Service de passation des marchés</label>
                        <input type="text"/>
                    </div>
                    <div className="form-group">
                        <label>Objectif de l'opération</label>
                        <textarea rows='10' cols='50'></textarea>
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
                                    checked={typeDeTravau === 'Travaux'}
                                    onChange={(e) => setTypeDeTravau(e.target.value)}
                                />
                                Travaux
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="typeDeTravau"
                                    value="Prestations"
                                    checked={typeDeTravau === 'Prestations'}
                                    onChange={(e) => setTypeDeTravau(e.target.value)}
                                />
                                Prestations
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="typeDeTravau"
                                    value="Equipement"
                                    checked={typeDeTravau === 'Equipement'}
                                    onChange={(e) => setTypeDeTravau(e.target.value)}
                                />
                                Equipement
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="typeDeTravau"
                                    value="Etude"
                                    checked={typeDeTravau === 'Etude'}
                                    onChange={(e) => setTypeDeTravau(e.target.value)}
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
                                    checked={typeDeBudget === 'Equipement'}
                                    onChange={(e) => setTypeDeBudget(e.target.value)}
                                />
                                Equipement
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="typeDeBudget"
                                    value="Fonctionnement"
                                    checked={typeDeBudget === 'Fonctionnement'}
                                    onChange={(e) => setTypeDeBudget(e.target.value)}
                                />
                                Fonctionnement
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="typeDeBudget"
                                    value="Opérations Hors Budget"
                                    checked={typeDeBudget === 'Opérations Hors Budget'}
                                    onChange={(e) => setTypeDeBudget(e.target.value)}
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
                                    value="Appel des Offres Ouvert"
                                    checked={methodAttribuation === 'Appel des Offres Ouvert'}
                                    onChange={(e) => setMethodAttribuation(e.target.value)}
                                />
                                Appel des Offres Ouvert
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="methodAttribuation"
                                    value="Appel des Offres Restreint"
                                    checked={methodAttribuation === 'Appel des Offres Restreint'}
                                    onChange={(e) => setMethodAttribuation(e.target.value)}
                                />
                                Appel des Offres Restreint
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Market and Visa */}
            {currentStep === 3 && (
                <div className="informations-container step-content">
                    <h1>Marché et Visa</h1>
                    <div className="form-group">
                        <label>Numéro de visa</label>
                        <input type="text"/>
                    </div>
                    <div className="form-group">
                        <label>Date de visa</label>
                        <input type='date'/>
                    </div>
                </div>
            )}

            <div className="navigation-buttons">
                {currentStep > 1 && (
                    <button className="nav-btn prev-btn" onClick={prevStep}>
                        Précédent
                    </button>
                )}
                {currentStep < 3 ? (
                    <button className="nav-btn next-btn" onClick={nextStep}>
                        Suivant
                    </button>
                ) : (
                    <button className="submit-btn">Soumettre</button>
                )}
            </div>
        </div>
    )
}

export default NewOperation;