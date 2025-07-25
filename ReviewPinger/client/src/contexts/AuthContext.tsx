import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { loginUser as apiLogin, register as apiRegister, getCurrentUser, logout as apiLogout } from '@/api/auth'

interface User {
  id: string
  email: string
  role: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, role?: string) => Promise<void>
  logout: () => void
  loading: boolean
  isAdmin: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  console.log('AUTH CONTEXT: Provider rendering')
  console.log('AUTH CONTEXT: Current user state:', user)
  console.log('AUTH CONTEXT: Loading state:', loading)

  useEffect(() => {
    console.log('AUTH CONTEXT: useEffect triggered - checking authentication')
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      console.log('AUTH CONTEXT: Checking if user is authenticated')
      const accessToken = localStorage.getItem('accessToken')
      console.log('AUTH CONTEXT: Access token present:', !!accessToken)

      if (accessToken) {
        console.log('AUTH CONTEXT: Fetching current user data')
        const userData = await getCurrentUser()
        console.log('AUTH CONTEXT: User data received:', userData)

        // Fix: The API returns user data directly, not wrapped in a user property
        const userInfo = userData.user || userData // Handle both cases
        console.log('AUTH CONTEXT: Extracted user data:', userInfo)

        // Convert _id to id for consistency
        const normalizedUser = {
          id: userInfo._id || userInfo.id,
          email: userInfo.email,
          role: userInfo.role,
          createdAt: userInfo.createdAt
        }

        setUser(normalizedUser)
        setIsAuthenticated(true)
        console.log('AUTH CONTEXT: User restored from token:', normalizedUser)
      } else {
        console.log('AUTH CONTEXT: No access token found')
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('AUTH CONTEXT: Error checking authentication:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
      console.log('AUTH CONTEXT: Authentication check completed')
    }
  }

  const login = async (email: string, password: string) => {
    console.log('AUTH CONTEXT: Login attempt for email:', email)
    try {
      const response = await apiLogin({ email, password })
      console.log('AUTH CONTEXT: Login response received:', response)

      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)

      const userData = await getCurrentUser()
      console.log('AUTH CONTEXT: User data after login:', userData)

      // Fix: Handle the user data structure properly
      const userInfo = userData.user || userData
      const normalizedUser = {
        id: userInfo._id || userInfo.id,
        email: userInfo.email,
        role: userInfo.role,
        createdAt: userInfo.createdAt
      }

      setUser(normalizedUser)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('AUTH CONTEXT: Login error:', error)
      throw error
    }
  }

  const register = async (email: string, password: string, role: string = 'user') => {
    console.log('AUTH CONTEXT: Register attempt for email:', email, 'with role:', role)
    try {
      const response = await apiRegister({ email, password, role })
      console.log('AUTH CONTEXT: Register response received:', response)

      localStorage.setItem('accessToken', response.accessToken)

      const userData = await getCurrentUser()
      console.log('AUTH CONTEXT: User data after register:', userData)

      // Fix: Handle the user data structure properly
      const userInfo = userData.user || userData
      const normalizedUser = {
        id: userInfo._id || userInfo.id,
        email: userInfo.email,
        role: userInfo.role,
        createdAt: userInfo.createdAt
      }

      setUser(normalizedUser)
      setIsAuthenticated(true)
      console.log('AUTH CONTEXT: Registration successful for user:', normalizedUser)
    } catch (error) {
      console.error('AUTH CONTEXT: Registration failed:', error)
      throw error
    }
  }

  const logout = () => {
    console.log('AUTH CONTEXT: Logging out user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    setIsAuthenticated(false)

    // Call API logout if needed
    apiLogout().catch(error => {
      console.error('AUTH CONTEXT: API logout failed:', error)
    })
  }

  const isAdmin = user?.role === 'admin'

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAdmin,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}