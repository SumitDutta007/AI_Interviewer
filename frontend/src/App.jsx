import { Navigate, Route } from "react-router-dom"
import { Routes } from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import ResumeScorer from "./pages/ResumeScorer"
import { useState, useEffect } from "react"
import { getCurrentUser } from "./apis/user.api"
import api from "./utils/axios"
import { getRedirectResult, onAuthStateChanged } from "firebase/auth"
import { auth, authPersistence } from "./utils/firebase"
import { getResume } from "./apis/resume.api"
import { useDispatch } from "react-redux"
import { setResume } from "./redux/resumeSlice"

function App() {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const dispatch = useDispatch()

  useEffect(()=>{
    const completeRedirect = async () => {
      try {
        await authPersistence
        await getRedirectResult(auth)
      } catch (error) {
        console.error("[auth] Redirect result failed:", error)
      }
    }

    completeRedirect()

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setLoading(false)
        return
      }

      try {
        const token = await firebaseUser.getIdToken()
        const loginResponse = await api.post("/api/auth/login", { token })
        setUser(loginResponse.data?.user ?? null)
        const currentUserResponse = await getCurrentUser()
        setUser(currentUserResponse?.user ?? loginResponse.data?.user ?? null)
      } catch (error) {
        console.error("[auth] Sign-in flow failed:", {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
        })
        setUser(null)
      } finally {
        setLoading(false)
      }

    })

    return unsubscribe
  }, [])

  useEffect(() => {
    const getResumeData = async () => {
      if (!user) {
        dispatch(setResume(null))
        return
      }

      const result = await getResume()
      dispatch(setResume(result?.data ?? null))
    }

    getResumeData()
  }, [dispatch, user])

  if(loading){
    return <div>Loading...</div>
  }

  return (
    <>
      <Routes>
        <Route path="/" element={ user ? <Navigate to="/dashboard" replace/> : <Home user = {user} setUser={setUser} /> } />
        <Route path="/dashboard" element={ user ? <Dashboard user = {user} setUser = {setUser}/> : <Navigate to="/" replace/> } />
        <Route path="/resumeScorer" element={ user ? <ResumeScorer user = {user} setUser = {setUser}/> : <Navigate to="/" replace/> } />

      </Routes>
    </>
  )
}

export default App
