import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import { useAuth } from '../context/AuthContext'
import TextInput from '../components/Shared/FormElements/TextInput'
import ForgotPasswordModal from '../components/ResetPassword/ForgotPasswordModal'
import { useTranslation } from 'react-i18next'

function Login() {
  const navigate = useNavigate()
  const { loginUser, error: loginError } = useLogin()
  const { user } = useAuth()
  const { t } = useTranslation()


  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (error) setError('')
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const result = await loginUser(formData.email, formData.password);
      setIsLoading(false);
  
      console.log("Login result:", result);
  
      if (result && result.userId) {
        console.log("dash: open");
        navigate('/dashboard');
      } else {
        setError(t('login.invalidCredentials'));
      }
    } catch (err) {
      setIsLoading(false);
      setError(t('login.invalidCredentials'));
      console.error("Login error:", err); // سجل أي خطأ
    }
  };
  
  
  

  useEffect(() => {
    if (loginError) {
      setError(loginError)
    }
  }, [loginError])

  return (
    <div className="min-h-screen w-screen flex bg-slate-50">
      {/* Form Section */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            {t('login.title')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <TextInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('login.emailPlaceholder')}
              required
              label={t('login.email')}
            />

            <TextInput
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={t('login.passwordPlaceholder')}
              required
              label={t('login.password')}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="accent-slate-600"
                />
                {t('login.rememberMe')}
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="cursor-pointer text-slate-600 hover:underline"
              >
                {t('login.forgotPassword')}
              </button>
            </div>

            {error && (
              <motion.div
                className="text-sm text-red-600 font-semibold"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-700 transition"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.97 }}
            >
              {isLoading ? t('login.loading') : t('login.submit')}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>

      {/* Welcome Panel */}
      <motion.div
        className="hidden lg:flex w-1/2 items-center justify-center bg-slate-800 text-white"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-2xl text-center px-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {t('login.welcomeTitle')}
          </h1>
          <p className="text-slate-100 text-lg md:text-xl">
            {t('login.welcomeText')}
          </p>
        </div>
      </motion.div>
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSubmit={(email) => {
          console.log('Email envoyé pour réinitialisation :', email)
          setShowForgotPassword(false)
        }}
      />
    </div>
  )
}

export default Login
