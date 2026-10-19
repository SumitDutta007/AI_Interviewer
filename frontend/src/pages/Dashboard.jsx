import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../utils/firebase'
import { logoutUser } from '../apis/user.api'

const Dashboard = ({user, setUser}) => {
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)

    try {
      await logoutUser()
    } catch (error) {
      console.error('[auth] Logout failed:', error)
    } finally {
      try {
        await signOut(auth)
      } catch (error) {
        console.error('[auth] Firebase sign-out failed:', error)
      }

      setUser(null)
    }
  }

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>Hello, {user?.name}!</p>
      <p>Email: {user?.email}</p>
      <button onClick={handleLogout} disabled={loggingOut}>
        {loggingOut ? 'Signing out...' : 'Logout'}
      </button>
    </div>
  )
}

export default Dashboard
