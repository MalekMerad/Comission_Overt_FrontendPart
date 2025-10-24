import React from 'react';
import { motion } from 'framer-motion';
import { sectionVariant, cardVariant } from '../motion';
import '../../styles/pagesStyles/login.css'
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="login-container"
      variants={sectionVariant}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <div className="login-form-section">
        <motion.div
          className="login-form-container"
          variants={cardVariant}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <motion.h2
            className="login-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Connexion
          </motion.h2>
          <motion.form
            className="login-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div
              className="form-field"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <label>Adresse e-mail</label>
              <input 
                type="email" 
                placeholder="Entrez votre e-mail"
                className="login-input"
              />
            </motion.div>
            <motion.div
              className="form-field"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <label>Mot de passe</label>
              <input 
                type="password" 
                placeholder="Entrez votre mot de passe"
                className="login-input"
              />
            </motion.div>
            <motion.div
              className="form-options"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <label className="remember-me">
                <input type="checkbox" />
                Se souvenir de moi
              </label>
              <a href="#" className="forgot-password">Mot de passe oublié ?</a>
            </motion.div>
            <motion.button
              type="submit"
              className="login-button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Se connecter
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
      <motion.div
        className="welcome-panel"
        variants={cardVariant}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <motion.div
          className="welcome-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Bienvenue sur PlisFlow
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Nous sommes ravis de vous revoir ! Connectez-vous à votre compte pour accéder 
            à toutes les fonctionnalités de notre plateforme et poursuivre votre expérience.
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Login;