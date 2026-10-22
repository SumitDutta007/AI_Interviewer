import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { FiShield, FiX } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { auth, authPersistence, provider } from '../utils/firebase'
import { signInWithPopup, signInWithRedirect } from 'firebase/auth'
import api from '../utils/axios'

const LoginModel = ({ onClose, setUser }) => {
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const handleKeyDown = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

const handleGoogleAuth = async () => {
  setIsSigningIn(true)
  setErrorMessage('')

  try {
    await authPersistence

    const result = await signInWithPopup(auth, provider)
    const token = await result.user.getIdToken()
    const response = await api.post('/api/auth/login', { token })
    setUser(response?.data?.user ?? null)
    onClose()
  }
  catch (error){
    if (error.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, provider)
      return
    }

    console.error('[auth] Google sign-in failed:', error.code || error.message)
    setErrorMessage(error.response?.data?.message || error.message || 'Google sign-in failed')
    setIsSigningIn(false)
  }
}

  return (
    <motion.div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.section className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title" initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: 0.28 }}>
        <button className="modal-close" onClick={onClose} aria-label="Close login"><FiX /></button>
        <div className="modal-intro"><span className="modal-kicker">Welcome back</span><h2 id="login-title">Secure sign in<br /><em>with Google.</em></h2><p>Continue to your interview dashboard and practice history in one click.</p></div>
        <div className="login-actions">
        <button className="google-button" type="button" onClick={handleGoogleAuth} disabled={isSigningIn}>
          <FcGoogle /> {isSigningIn ? 'Connecting to Google...' : 'Continue with Google'}
        </button>
        </div>
        {errorMessage && <p className="modal-error" role="alert">{errorMessage}</p>}
        <p className="modal-security"><FiShield /> Your data is encrypted and never sold.</p>
        <p className="modal-legal">By continuing, you agree to Voxen's terms and privacy policy.</p>
      </motion.section>
    </motion.div>
  )
}

export default LoginModel
