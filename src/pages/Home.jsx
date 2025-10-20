import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sectionVariant, cardVariant, mainImgVariant, speechVariant, serviceContentVariant } from '../motion'
import mainImage from '../assets/Comission Overture 4.png'
import '../../styles/pagesStyles/Home.css'
import { reasons } from '../Data/Reasons'
import { services } from '../Data/Services'


function Home() {
  const [activeService, setActiveService] = useState(0);

  const handleNextService = () => {
    setActiveService((prev) => (prev + 1) % services.length);
  };
  const handlePrevService = () => {
    setActiveService((prev) => (prev - 1 + services.length) % services.length);
  };

  return (
    <div className='sections-container'>
      <motion.section
        id='Accueil'
        className='home-section section1'
        style={{ height: '100vh' }}
        variants={sectionVariant}
        initial="hidden"
        animate="visible"
      >
        <div className='section1-img-Container'>
          <motion.img
            src={mainImage}
            alt="Comission Overture"
            variants={mainImgVariant}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1.1, delay: 0.1 }}
            style={{ width: "100%" }}
          />
          <motion.div
            className='section1-speech-container'
            variants={speechVariant}
            initial="hidden"
            animate="visible"
            transition={{ duration: 1, delay: 0.4 }}
          >
            <motion.h1
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
            >
              Favoriser la Collaboration Ouverte
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              Bienvenue sur <strong>Project Overture</strong> — la plateforme d’enchères ouvertes
              où entreprises et innovateurs se rencontrent. Publiez vos projets, soumettez
              des offres compétitives et créez des partenariats durables pour transformer
              vos idées en réalité.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.35 }}
            >
              En voir plus
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id='Choisir'
        className='home-section section2'
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div
          className='nos-choisir-context'
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h1>
            Pour quoi utilise <strong>Project Overt</strong> ?
          </h1>
          <p>
            Project Overt est conçu pour simplifier et optimiser la gestion des appels d’offres.
            Il permet aux entreprises et institutions de centraliser les propositions,
            évaluer les fournisseurs en toute transparence et suivre l'avancement des projets
            jusqu'à leur réalisation finale.
          </p>
        </motion.div>
        <motion.div
          className='nos-choisir-cards'
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              className='nos-choisir-card'
              custom={index}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div>
                <h1>{reason.title}</h1>
                <p>{reason.service}</p>
              </div>
              <motion.button
                className='nos-choisir-card-button'
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 420, damping: 20 }}
              >
                + En savoir plus
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
      
      <motion.section
        id='Service'
        className='home-section section3'
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          className='nos-service-switcher'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.button 
            className='service-arrow service-arrow-prev'
            onClick={handlePrevService}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.93 }}
            aria-label="Précédent Service"
            transition={{ type: "spring", stiffness: 400, damping: 16 }}
          >
            ‹
          </motion.button>
          <motion.button 
            className='service-arrow service-arrow-next'
            onClick={handleNextService}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.93 }}
            aria-label="Suivant Service"
            transition={{ type: "spring", stiffness: 400, damping: 16 }}
          >
            ›
          </motion.button>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className='service-content'
              key={activeService}
              variants={serviceContentVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "spring", duration: 0.4 }}
              layout
            >
              <h1>{services[activeService].title}</h1>
              <p>{services[activeService].service}</p>
            </motion.div>
          </AnimatePresence>
          <motion.div
            className='service-dots'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            {services.map((_, index) => (
              <motion.button
                key={index}
                className={`service-dot ${activeService === index ? 'active' : ''}`}
                onClick={() => setActiveService(index)}
                whileHover={{ scale: 1.18 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                aria-label={`Aller au service ${index + 1}`}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  )
}

export default Home