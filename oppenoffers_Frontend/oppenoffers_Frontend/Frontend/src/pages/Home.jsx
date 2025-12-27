import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import PlatformLogo from '../assets/Logo-Home.png'

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
    <div className='w-screen h-screen flex items-center justify-center bg-white'>
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div
            className='flex flex-col items-center gap-6 text-slate-900 cursor-pointer'
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
              }
            }}
            onClick={handleSkip}
          >
            {/* Logo */}
            <motion.div
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
              }}
            >
              <img 
                src={PlatformLogo} 
                alt="Project Overture Logo" 
                className='w-32 h-32 object-contain'
              />
            </motion.div>

            {/* Platform Name */}
            <motion.h1
              className='text-4xl font-bold tracking-wide'
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
              }}
            >
              PlisFlow
            </motion.h1>
              
            {/* Loading Bar */}
            <motion.div
              className='w-64 h-2 bg-slate-700 rounded overflow-hidden'
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: 1.2, duration: 0.5 }
              }}
              exit={{ 
                opacity: 0,
              }}
            >
              <motion.div
                className='h-full bg-slate-500 origin-left'
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

            {/* Skip Hint */}
            <motion.p
              className='text-sm text-slate-400'
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
        <div className='hidden'>
        </div>
      )}
    </div>
  )
}

export default Home