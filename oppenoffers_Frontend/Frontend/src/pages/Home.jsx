import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PlatformLogo from '../assets/Logo2.png'
import '../../styles/pagesStyles/Home.css'

function Home() {
  const navigate = useNavigate()
  const [showSplash, setShowSplash] = useState(true)
  const [startExit, setStartExit] = useState(false)

  useEffect(() => {
    
    const navigateTimer = setTimeout(() => {
      setShowSplash(false)
      navigate('/login')
    }, 3000) 
    return () => {
      clearTimeout(navigateTimer)
    }
  }, [navigate])

  const handleSkip = () => {
    setStartExit(true)
    setTimeout(() => {
      setShowSplash(false)
      navigate('/login')
    }, 500)
  }

  return (
    <div className='splash-container'>
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div
            className='splash-content'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: { duration: 0.8, ease: "easeOut" }
            }}
            exit={{ 
              opacity: 0, 
              scale: 1.05,
              transition: { 
                duration: 0.6, 
                ease: "easeIn",
                opacity: { duration: 0.5 }
              }
            }}
            onClick={handleSkip}
            style={{ cursor: 'pointer' }}
          >
            <motion.div
              className='logo-container'
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                transition: { 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 25,
                  delay: 0.3
                }
              }}
              exit={{
                scale: 0.8,
                opacity: 0,
                transition: { duration: 0.4, ease: "easeIn" }
              }}
            >
              <img 
                src={PlatformLogo} 
                alt="Project Overture Logo" 
                className='splash-logo'
              />
            </motion.div>
            
            <motion.h1
              className='platform-name'
              initial={{ y: 30, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1,
                transition: { 
                  duration: 0.7,
                  ease: "easeOut",
                  delay: 0.8
                }
              }}
              exit={{
                y: -20,
                opacity: 0,
                transition: { duration: 0.4, ease: "easeIn" }
              }}
            >
              PlisFlow
            </motion.h1>

            <motion.div
              className='loading-bar-container'
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 1.2, duration: 0.5 }
              }}
              exit={{ 
                opacity: 0,
                transition: { duration: 0.3 }
              }}
            >
              <motion.div
                className='loading-bar'
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: 1,
                  transition: { 
                    duration: 2.2,
                    delay: 1.2,
                    ease: "easeInOut"
                  }
                }}
                exit={{ 
                  scaleX: 1,
                  transition: { duration: 0.3 }
                }}
              />
            </motion.div>
            <motion.p
              className='skip-hint'
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 0.7,
                transition: { delay: 2, duration: 0.5 }
              }}
              exit={{ opacity: 0 }}
            >
              Cliquez pour continuer
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      {startExit && (
        <div style={{ display: 'none' }}>
        </div>
      )}
    </div>
  )
}

export default Home