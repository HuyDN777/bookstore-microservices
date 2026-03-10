import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

type User = {
  id: number
  username: string
  email: string
  is_staff?: boolean
}

type AuthState = {
  token: string | null
  user: User | null
}

type AuthContextValue = AuthState & {
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'bookstore-auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    if (typeof window === 'undefined') return { token: null, user: null }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return { token: null, user: null }
      return JSON.parse(raw) as AuthState
    } catch {
      return { token: null, user: null }
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login(token, user) {
          setState({ token, user })
        },
        logout() {
          setState({ token: null, user: null })
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

