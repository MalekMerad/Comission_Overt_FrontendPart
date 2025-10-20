import React from 'react';
import '../../styles/pagesStyles/signup.css'
import { useNavigate } from 'react-router-dom';
function Signup() {

  const navigate = useNavigate();
  return (
    <div className="signup-container">
      <div className="signup-form-section">
        <div className="signup-form-container">
          <h2 className="signup-title">Créer un compte</h2>
          <form className="signup-form">
            <div className="form-row">
              <div className="form-field">
                <label>Prénom *</label>
                <input 
                  type="text" 
                  placeholder="Entrez votre prénom"
                  className="signup-input"
                />
              </div>
              <div className="form-field">
                <label>Nom *</label>
                <input 
                  type="text" 
                  placeholder="Entrez votre nom"
                  className="signup-input"
                />
              </div>
            </div>
            <div className="form-field">
              <label>Adresse e-mail *</label>
              <input 
                type="email" 
                placeholder="Entrez votre e-mail"
                className="signup-input"
              />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Mot de passe *</label>
                <input 
                  type="password" 
                  placeholder="Créez un mot de passe"
                  className="signup-input"
                />
              </div>
              <div className="form-field">
                <label>Confirmer le mot de passe *</label>
                <input 
                  type="password" 
                  placeholder="Confirmez votre mot de passe"
                  className="signup-input"
                />
              </div>
            </div>
            <div className="form-options">
              <label className="terms-agreement">
                <input type="checkbox" />
                J'accepte les <a href="#">conditions d'utilisation</a> et la <a href="#">politique de confidentialité</a>
              </label>
            </div>
            <button type="submit" className="signup-button">S'inscrire</button>
            <div className="login-link">
              <p>Vous avez déjà un compte ? <a onClick={() => { navigate('/login'); }} style={{cursor:'pointer', color:'#007bff', textDecoration:'underline'}} >Connectez</a></p>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Welcome Panel */}
      <div className="welcome-panel">
        <div className="welcome-content">
          <h1>Rejoignez Project Overt</h1>
          <p>
            Créez votre compte dès aujourd'hui et découvrez toutes les fonctionnalités 
            exclusives de notre plateforme. Faites partie de notre communauté et 
            transformez votre façon de travailler.
          </p>
          <div className="benefits-list">
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span>Accès à toutes les fonctionnalités premium</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span>Support prioritaire 24/7</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span>Personnalisation avancée</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;