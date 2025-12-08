import { useState } from "react";
import '../../../styles/componentsStyles/NewSupplier.css';
import { newSupplier } from '../../services/supplierService';
import { useToast } from '../../hooks/useToast';
import { useAuth } from "../../context/AuthContext";
import TextInput from "../FormElements/TextInput";
import regexFormats  from "../../utils/rgexFormats"

function NewSupplier() {
    const { showToast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const {user} = useAuth();

    const [formData, setFormData] = useState({
        NomSociete: '',
        NatureJuridique: '',
        Adresse: '',
        Telephone: '',
        Rc: '',
        Nif: '',
        Rib: '',
        Email: '',
        Ai: '',
        AgenceBancaire: '',
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

    const validateForm = () => {
        const errors = [];

        if (!formData.NomSociete.trim()) {
            errors.push("Le nom de la société est obligatoire.");
        }

        if (!formData.Adresse.trim() || !regexFormats.address.test(formData.Adresse)) {
            errors.push("L'adresse est invalide.");
        }

        if (!regexFormats.phone.test(formData.Telephone)) {
            errors.push("Le numéro de téléphone n'est pas valide.");
        }

        if (!regexFormats.email.test(formData.Email)) {
            errors.push("L'adresse email est invalide.");
        }

        if (!formData.Rc.trim()) {
            errors.push("Le numéro RC est obligatoire.");
        }

        if (!formData.Nif.trim()) {
            errors.push("Le numéro NIF est obligatoire.");
        }

        if (!formData.Ai.trim()) {
            errors.push("L'AI est obligatoire.");
        }

        if (!formData.Rib.trim() || formData.Rib.length < 10) {
            errors.push("Le RIB est invalide.");
        }

        if (!formData.AgenceBancaire.trim()) {
            errors.push("L'agence bancaire est obligatoire.");
        }

        return errors;
    };


    const handleSubmit = async () => {
        const requiredFields = ['NomSociete', 'NatureJuridique', 'Adresse', 'Telephone', 'Rc', 'Nif', 'Rib', 'Email', 'Ai', 'AgenceBancaire'];
        const emptyFields = requiredFields.filter(field => !formData[field]);
        const validationErrors = validateForm();
        console.log(formData);

        if (validationErrors.length > 0) {
            validationErrors.forEach(err =>
                showToast(err, 'error')
            );
            return;
        }

        if (emptyFields.length > 0) {
            showToast('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }
    
        setIsSubmitting(true);
    
        try {
            const cleanFormData = {
                NomSociete: formData.NomSociete || '',
                NatureJuridique: formData.NatureJuridique || '',
                Adresse: formData.Adresse || '',
                Telephone: formData.Telephone || '',
                Rc: formData.Rc || '',
                Nif: formData.Nif || '',
                Rib: formData.Rib || '',
                Email: formData.Email || '',
                Ai: formData.Ai || '',
                AgenceBancaire: formData.AgenceBancaire || '',
                adminId: user?.userId || ''
            };
    
            console.log('🧹 Cleaned form data:', cleanFormData);
            
            const result = await newSupplier(cleanFormData);
    
            if (result && typeof result.code !== 'undefined') {
                switch (result.code) {
                    case 0:
                        showToast('Fournisseur ajouté avec succès!', 'success');
                        setFormData({
                            NomSociete: '',
                            NatureJuridique: '',
                            Adresse: '',
                            Telephone: '',
                            Rc: '',
                            Nif: '',
                            Rib: '',
                            Email: '',
                            Ai: '',
                            AgenceBancaire: ''
                            // Don't include adminId in form reset
                        });
                        setCurrentStep(1);
                        break;
    
                    case 1002:
                        showToast('Un fournisseur avec ce RC existe déjà.', 'warning');
                        break;
    
                    case 1003:
                        showToast('Un fournisseur avec ce NIF existe déjà.', 'warning');
                        break;
                    case 1004:
                        showToast('Un fournisseur avec ce numéro de téléphone existe déjà.', 'warning');
                        break;

                    case 1005:
                        showToast('Un fournisseur avec cet AI existe déjà.', 'warning');
                        break;

                    case 1006:
                        showToast('Un fournisseur avec ce RIB existe déjà.', 'warning');
                        break;

                    case 1007:
                        showToast('Un fournisseur avec cet email existe déjà.', 'warning');
                        break;
                
                    case 5000:
                        showToast('Une erreur générale est survenue. Veuillez réessayer.', 'error');
                        break;
    
                    default:
                        showToast(`Réponse inattendue du serveur (code: ${result.code}).`, 'error');
                }
            } else {
                showToast('Réponse inattendue du serveur (aucun code retourné).', 'error');
            }
    
        } catch (error) {
            console.error('Frontend error:', error);
            if (error.validationError) {
                error.validationError.forEach(err => showToast(err, 'error'));
            } else {
                showToast(error.message || "Erreur lors de l'ajout du fournisseur.", 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="NewSupplier-container">
            <div className="progress-steps">
                <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                    <div className="step-number">1</div>
                    <span>Informations sur l'entreprise</span>
                </div>
                <div className="step-connector"></div>
                <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                    <div className="step-number">2</div>
                    <span>Identifiants légaux et fiscaux</span>
                </div>
                <div className="step-connector"></div>
                <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <span>Coordonnées et informations bancaires</span>
                </div>
            </div>

            {currentStep === 1 && (
                <div className="informations-container step-content">
                    <h1>Informations sur l'entreprise</h1>
                    <TextInput
                        label="Nom de la société"
                        name="NomSociete"
                        placeholder="Ex: Nom de l'entreprise"
                        value={formData.NomSociete}
                        onChange={handleInputChange}
                    />
                    <TextInput
                        label="Nature juridique"
                        name="NatureJuridique"
                        placeholder="Ex: SARL, EURL, SA"
                        value={formData.NatureJuridique}
                        onChange={handleInputChange}
                    />
                    <TextInput
                        label="Adresse"
                        name="Adresse"
                        placeholder="Ex: 123 Rue de l'Exemple, Ville"
                        value={formData.Adresse}
                        onChange={handleInputChange}
                    />
                </div>
            )}

            {currentStep === 2 && (
                <div className="informations-container step-content">
                    <h1>Identifiants légaux et fiscaux</h1>
                    <TextInput
                        label="Nomber de Registre de Commerce"
                        name="Rc"
                        placeholder="Ex: 123456789"
                        value={formData.Rc}
                        onChange={handleInputChange}
                    />
                    <TextInput
                        label="Numéro d'Identification Fiscale (NIF)"
                        name="Nif"
                        placeholder="Ex: 987654321"
                        value={formData.Nif}
                        onChange={handleInputChange}
                    />
                    <TextInput
                        label="Article d'imposition (AI)"
                        name="Ai"
                        placeholder="Ex: A12345678"
                        value={formData.Ai}
                        onChange={handleInputChange}
                    />
                </div>
            )}

            {currentStep === 3 && (
                <div className="informations-container step-content">
                    <h1>Coordonnées et informations bancaires</h1>
                    <TextInput
                        label="Téléphone"
                        name="Telephone"
                        placeholder="+213 795552866"
                        value={formData.Telephone}
                        onChange={handleInputChange}
                    />
                    <TextInput
                        label="Email"
                        name="Email"
                        type="text"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="Ex: email@example.com"
                        value={formData.Email}
                        onChange={handleInputChange}
                    />
                    <TextInput
                        label="Relevé d'Identité Bancaire (RIB)"
                        name="Rib"
                        placeholder="Ex: 12345678901234567890"
                        value={formData.Rib}
                        onChange={handleInputChange}
                    />
                    <TextInput
                        label="Agence bancaire"
                        name="AgenceBancaire"
                        placeholder="Ex: Nom de la banque, Ville"
                        value={formData.AgenceBancaire}
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

export default NewSupplier;