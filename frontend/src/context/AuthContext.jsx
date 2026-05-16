import { createContext, useContext, useState, useEffect } from 'react'
import API from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('redora_token')
      const saved = localStorage.getItem('redora_user')
      if (token && saved) {
        try {
          setUser(JSON.parse(saved))
        } catch (e) {
          localStorage.removeItem('redora_user')
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email, password) => {
    // 1. Purge any old session data first to prevent clashing
    localStorage.removeItem('redora_token')
    localStorage.removeItem('redora_user')
    
    const res = await API.post('/auth/login', { email, password })
    if (res.data.success) {
      // 2. Save new data
      localStorage.setItem('redora_token', res.data.token)
      localStorage.setItem('redora_user', JSON.stringify(res.data.user))
      
      // 3. Force update API headers immediately for the next request
      API.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
      
      setUser(res.data.user)
    }
    return res.data
  }

  const register = async (username, email, password) => {
    localStorage.removeItem('redora_token')
    localStorage.removeItem('redora_user')
    
    const res = await API.post('/auth/register', { username, email, password })
    if (res.data.success) {
      localStorage.setItem('redora_token', res.data.token)
      localStorage.setItem('redora_user', JSON.stringify(res.data.user))
      
      API.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
      
      setUser(res.data.user)
    }
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('redora_token')
    localStorage.removeItem('redora_user')
    delete API.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
