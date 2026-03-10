import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CUSTOMER_BASE =
  import.meta.env.VITE_CUSTOMER_SERVICE_URL ??
  (typeof window !== 'undefined' ? 'http://localhost:8002' : '')

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${CUSTOMER_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Đăng nhập thất bại')
      }
      const data = (await res.json()) as { key: string; user: any }
      login(data.key, {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        is_staff: data.user.is_staff,
      })
      navigate('/books')
    } catch (err) {
      console.error(err)
      setError('Sai tài khoản hoặc mật khẩu, hoặc customer-service chưa chạy.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page authPage">
      <div className="pageHeader">
        <div>
          <h1 className="h1">Đăng nhập</h1>
          <p className="muted">Đăng nhập tài khoản khách hàng để đặt hàng và xem lịch sử đơn.</p>
          {error && <p className="muted">{error}</p>}
        </div>
      </div>

      <form className="authForm" onSubmit={handleSubmit}>
        <label className="authField">
          <span>Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </label>
        <label className="authField">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        <button className="btn btnPrimary authSubmit" type="submit" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  )
}

