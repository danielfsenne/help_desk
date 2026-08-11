import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { http, setAuthToken } from '../api/http'
import type { User } from '../types'

const USER_KEY = 'helpdesk.currentUser'

interface AuthContextValue {
  currentUser: User | null
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? (JSON.parse(stored) as User) : null
  })

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  }, [currentUser])

  useEffect(() => {
    const interceptorId = http.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setAuthToken(null)
          setCurrentUser(null)
        }
        return Promise.reject(error)
      },
    )
    return () => http.interceptors.response.eject(interceptorId)
  }, [])

  function login(token: string, user: User) {
    setAuthToken(token)
    setCurrentUser(user)
  }

  function logout() {
    setAuthToken(null)
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
