import React, { useState } from 'react'
import PlatformLogo from '../assets/Logo2.png'
import '../../styles/componentsStyles/navBar.css'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleHamburgerClick = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const navigate = useNavigate();
  return (
    <div className='navBar-container'>
      <div className='logo-links-group'>
        <div className='Logo-field'>
          <img src={PlatformLogo} style={{ height: "100%", width: "100%", objectFit: "contain" }} alt="Logo"/>
        </div>
        <ul className={`links-field${menuOpen ? ' mobile-open' : ''}`} id="main-navigation">
          <li><a href="#Accueil" onClick={handleLinkClick}>Accueil</a></li>
          <li><a href="#Choisir" onClick={handleLinkClick}>Nos Choisir</a></li>
          <li><a href="#Service" onClick={handleLinkClick}>Nos Service</a></li>
          <li><a href="#Contact" onClick={handleLinkClick}>Contact</a></li>
        </ul>
      </div>
      <div className={`buttons-field${menuOpen ? ' mobile-open' : ''}`}>
        <button onClick={()=>{navigate('/register')}}>S'inscrire</button>
        <button onClick={()=>{navigate('/login')}}>Connexion</button>
      </div>
      <button
        className={`hamburger-menu${menuOpen ? ' open' : ''}`}
        onClick={handleHamburgerClick}
        aria-label="Menu"
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        type="button"
      >
        <span />
      </button>
    </div>
  );
}
export default Navbar