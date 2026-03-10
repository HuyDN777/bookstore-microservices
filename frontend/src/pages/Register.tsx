import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CUSTOMER_BASE =
  import.meta.env.VITE_CUSTOMER_SERVICE_URL ??
  (typeof window !== 'undefined' ? 'http://localhost:8002' : '')

export function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${CUSTOMER_BASE}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Đăng ký thất bại')
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
      setError('Đăng ký thất bại (có thể username đã tồn tại hoặc service chưa chạy).')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page authPage">
      <div className="pageHeader">
        <div>
          <h1 className="h1">Đăng ký</h1>
          <p className="muted">Tạo tài khoản khách hàng mới.</p>
          {error && <p className="muted">{error}</p>}
        </div>
      </div>

      <form className="authForm" onSubmit={handleSubmit}>
        <label className="authField">
          <span>Username</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label className="authField">
          <span>Email (tuỳ chọn)</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label className="authField">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
          />
        </label>
        <button className="btn btnPrimary authSubmit" type="submit" disabled={loading}>
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>
    </div>
  )
}

