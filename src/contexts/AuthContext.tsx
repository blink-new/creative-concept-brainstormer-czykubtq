import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  wallet?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize user from localStorage on app start
  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = localStorage.getItem('agentverse_user')
      const storedCredentials = localStorage.getItem('agentverse_credentials')
      
      if (storedUser && storedCredentials) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        } catch (error) {
          console.error('Error parsing stored user data:', error)
          localStorage.removeItem('agentverse_user')
          localStorage.removeItem('agentverse_credentials')
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const userData = {
      id: '1',
      name: 'Demo User',
      email,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format',
      wallet: '0x1234...5678'
    }
    
    // Store user data and credentials in localStorage
    localStorage.setItem('agentverse_user', JSON.stringify(userData))
    localStorage.setItem('agentverse_credentials', JSON.stringify({ email, password }))
    
    setUser(userData)
    setIsLoading(false)
  }

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const userData = {
      id: '1',
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format',
      wallet: '0x1234...5678'
    }
    
    // Store user data and credentials in localStorage
    localStorage.setItem('agentverse_user', JSON.stringify(userData))
    localStorage.setItem('agentverse_credentials', JSON.stringify({ email, password }))
    
    setUser(userData)
    setIsLoading(false)
  }

  const logout = () => {
    // Remove stored data
    localStorage.removeItem('agentverse_user')
    localStorage.removeItem('agentverse_credentials')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}