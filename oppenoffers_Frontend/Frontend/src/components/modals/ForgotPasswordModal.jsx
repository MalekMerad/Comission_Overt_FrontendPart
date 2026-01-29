import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TextInput from '../FormElements/TextInput'
import { ForgotPassword } from '../../hooks/useLogin'
import { useToast } from '../../hooks/useToast';



function ForgotPasswordModal({ isOpen, onClose}) {
  const [email, setEmail] = useState('')
  const [localError, setlocalError] = useState('')
  const { showToast } = useToast();

  const {sendResetLink, error, loading} = ForgotPassword()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setlocalError('Veuillez entrer votre adresse e-mail')
      return
    }
    setlocalError('')
    const result = await sendResetLink(email);
    console.debug("ForgotPasswordModal result:", result);
    if (result && result.id && result.email) {
      showToast("Le lien de réinitialisation a été envoyé à votre adresse e-mail");
      setEmail('');
      onClose && onClose();
    } else if (error) {
      setlocalError(error);
    } else {
      setlocalError("Une erreur est survenue lors de l'envoi du lien de réinitialisation.");
    }
     showToast("Le lien de réinitialisation a été envoyé à votre adresse e-mail")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-xl font-bold text-slate-800 mb-4 text-center">
              Mot de passe oublié
            </h2>

            <p className="text-sm text-slate-600 mb-5 text-center">
              Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <TextInput
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email@email.com"
                label="Adresse e-mail"
                required
              />

              {localError && (
                <div className="text-sm text-red-600 font-semibold">
                  {localError}
                </div>
              )}

              {error && (
                <div className="text-sm text-red-600 font-semibold">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 py-2 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-800"
                >
                  {loading ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ForgotPasswordModal
