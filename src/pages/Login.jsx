import React from 'react';
import '../../styles/pagesStyles/login.css'
import { useNavigate } from 'react-router-dom';

function Login() {

  const navigate = useNavigate();
  return (
    <div className="login-container">
      <div className="login-form-section">
        <div className="login-form-container">
          <h2 className="login-title">Connexion</h2>
          <form className="login-form">
            <div className="form-field">
              <label>Adresse e-mail</label>
              <input 
                type="email" 
                placeholder="Entrez votre e-mail"
                className="login-input"
              />
            </div>
            <div className="form-field">
              <label>Mot de passe</label>
              <input 
                type="password" 
                placeholder="Entrez votre mot de passe"
                className="login-input"
              />
            </div>
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                Se souvenir de moi
              </label>
              <a href="#" className="forgot-password">Mot de passe oublié ?</a>
            </div>
            <button type="submit" className="login-button">Se connecter</button>
            <div className="signup-link">
              <p>Vous n'avez pas de compte ? <a onClick={() => { navigate('/register'); }} style={{cursor:'pointer', color:'#007bff', textDecoration:'underline'}} >S'inscrire</a></p>
            </div>
          </form>
        </div>
      </div>
      <div className="welcome-panel">
        <div className="welcome-content">
          <h1>Bienvenue sur Project Overt</h1>
          <p>
            Nous sommes ravis de vous revoir ! Connectez-vous à votre compte pour accéder 
            à toutes les fonctionnalités de notre plateforme et poursuivre votre expérience.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;