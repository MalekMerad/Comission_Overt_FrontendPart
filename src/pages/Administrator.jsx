import '../../styles/pagesStyles/Administrator.css'
import PlatformLogo from '../assets/Logo2.png'
import { useState } from 'react';
import menuStructure from '../components/MenuStructure';

// Logos import
import supplierLogo from '../assets/parcelle.png';
import analyseLogo from '../assets/etude-de-marche.png';
import evaluationLogo from '../assets/evaluation.png';
import operationLogo from '../assets/project-management.png';
import comissionLogo from '../assets/salle-de-sous-commission.png';

const sectionLogos = {
    "Gestion des Opérations": operationLogo,
    "Gestion des Fournisseurs": supplierLogo,
    "Gestion de la Commission": comissionLogo,
    "Évaluation & Rapports": evaluationLogo,
    "Analyse General": analyseLogo
};

function Administrator(){
    const [activeSection, setActiveSection] = useState(null);
    const [activeSubMenu, setActiveSubMenu] = useState(null);

    const toggleSection = (section) => {
        if (activeSection === section) {
            setActiveSection(null);
            setActiveSubMenu(null);
        } else {
            setActiveSection(section);
            setActiveSubMenu(null);
        }
    };

    const toggleSubMenu = (subMenu) => {
        if (activeSubMenu === subMenu) {
            setActiveSubMenu(null);
        } else {
            setActiveSubMenu(subMenu);
        }
    };

    return(
        <div className="Gestionnaire-container">
            <div className="SideBar-container">
                <div className="SideBar-header">
                    <img src={PlatformLogo}/>
                </div>
                
                <nav className="SideBar-nav">
                    {Object.keys(menuStructure).map((section) => (
                        <div key={section} className="SideBar-section">
                            <div 
                                className={`SideBar-section-header ${activeSection === section ? 'active' : ''}`}
                                onClick={() => toggleSection(section)}
                            >
                                <img src={sectionLogos[section]} className='SideBar-section-header-logo' style={{height : 24, width : 24, marginRight : 10}}/>
                                <span>{section}</span>
                                <span className="dropdown-arrow">
                                    {Object.keys(menuStructure[section].submenus).length > 0 ? '▼' : ''}
                                </span>
                            </div>
                            
                            {activeSection === section && Object.keys(menuStructure[section].submenus).length > 0 && (
                                <div className="SideBar-submenu">
                                    {Object.keys(menuStructure[section].submenus).map((submenu) => (
                                        <div key={submenu} className="SideBar-submenu-item">
                                            <div 
                                                className={`SideBar-submenu-header ${activeSubMenu === submenu ? 'active' : ''}`}
                                                onClick={() => toggleSubMenu(submenu)}
                                            >
                                                <span>{submenu}</span>
                                                {menuStructure[section].submenus[submenu].length > 0 && (
                                                    <span className="submenu-arrow">▶</span>
                                                )}
                                            </div>
                                            
                                            {activeSubMenu === submenu && menuStructure[section].submenus[submenu].length > 0 && (
                                                <div className="SideBar-subsubmenu">
                                                    {menuStructure[section].submenus[submenu].map((item) => (
                                                        <div key={item} className="SideBar-subsubmenu-item">
                                                            {item}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="SideBar-footer">
                    <button className='SideBar-exitButton'>Déconnecter</button>
                </div>
            </div>
            <div className="ComponentContnet-container">
                this will have the section display
            </div>
        </div>
    )
}

export default Administrator;