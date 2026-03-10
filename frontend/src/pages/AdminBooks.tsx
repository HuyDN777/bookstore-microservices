import { FormEvent, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const BOOK_BASE =
  import.meta.env.VITE_BOOK_SERVICE_URL ??
  (typeof window !== 'undefined' ? 'http://localhost:8004' : '')

type Book = {
  id: number
  title: string
  author: string
  price: string
  description: string
  created_at: string
}

type EditState = {
  id?: number
  title: string
  author: string
  price: string
  description: string
}

export function AdminBooks() {
  const { user, token } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<EditState>({
    title: '',
    author: '',
    price: '',
    description: '',
  })

  const isEdit = editing.id !== undefined

  async function loadBooks() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BOOK_BASE}/books/`)
      if (!res.ok) throw new Error(`Book service error ${res.status}`)
      const data = (await res.json()) as Book[]
      setBooks(data)
    } catch (e) {
      console.error(e)
      setError('Không tải được danh sách sách (book-service chưa chạy?).')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.is_staff) {
      void loadBooks()
    }
  }, [user])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user?.is_staff) return
    if (!token) {
      alert('Thiếu token staff, hãy đăng nhập lại.')
      return
    }
    const body = {
      title: editing.title,
      author: editing.author,
      price: editing.price || '0',
      description: editing.description,
    }
    try {
      const url = isEdit ? `${BOOK_BASE}/books/${editing.id}/` : `${BOOK_BASE}/books/`
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`Save error ${res.status}`)
      setEditing({ id: undefined, title: '', author: '', price: '', description: '' })
      await loadBooks()
    } catch (err) {
      console.error(err)
      alert('Lưu sách thất bại.')
    }
  }

  async function handleDelete(id: number) {
    if (!user?.is_staff) return
    if (!token) {
      alert('Thiếu token staff, hãy đăng nhập lại.')
      return
    }
    if (!confirm('Xoá sách này?')) return
    try {
      const res = await fetch(`${BOOK_BASE}/books/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      })
      if (!res.ok && res.status !== 204) throw new Error(`Delete error ${res.status}`)
      setBooks((prev) => prev.filter((b) => b.id !== id))
    } catch (err) {
      console.error(err)
      alert('Xoá sách thất bại.')
    }
  }

  function startEdit(b: Book) {
    setEditing({
      id: b.id,
      title: b.title,
      author: b.author,
      price: b.price,
      description: b.description,
    })
  }

  if (!user?.is_staff) {
    return (
      <div className="page">
        <h1 className="h1">Books (Admin)</h1>
        <p className="muted">Chỉ nhân viên / admin mới truy cập được trang này.</p>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1 className="h1">Quản lý sách</h1>
          <p className="muted">Tạo mới, chỉnh sửa, xoá sách trong hệ thống.</p>
          {error && <p className="muted">{error}</p>}
        </div>
      </div>

      <form className="authForm" onSubmit={handleSubmit}>
        <label className="authField">
          <span>Tiêu đề</span>
          <input
            value={editing.title}
            onChange={(e) => setEditing((s) => ({ ...s, title: e.target.value }))}
            required
          />
        </label>
        <label className="authField">
          <span>Tác giả</span>
          <input
            value={editing.author}
            onChange={(e) => setEditing((s) => ({ ...s, author: e.target.value }))}
          />
        </label>
        <label className="authField">
          <span>Giá</span>
          <input
            type="number"
            step="0.01"
            value={editing.price}
            onChange={(e) => setEditing((s) => ({ ...s, price: e.target.value }))}
          />
        </label>
        <label className="authField">
          <span>Mô tả</span>
          <textarea
            rows={3}
            value={editing.description}
            onChange={(e) => setEditing((s) => ({ ...s, description: e.target.value }))}
          />
        </label>
        <button className="btn btnPrimary authSubmit" type="submit">
          {isEdit ? 'Cập nhật sách' : 'Thêm sách'}
        </button>
        {isEdit && (
          <button
            type="button"
            className="btn btnGhost authSubmit"
            onClick={() =>
              setEditing({ id: undefined, title: '', author: '', price: '', description: '' })
            }
          >
            Huỷ chỉnh sửa
          </button>
        )}
      </form>

      <h2 className="h1" style={{ marginTop: 24, fontSize: 18 }}>
        Danh sách sách
      </h2>

      {loading && <p className="muted">Đang tải...</p>}

      {books.length > 0 && (
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tiêu đề</th>
                <th>Tác giả</th>
                <th>Giá</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>${Number(b.price).toFixed(2)}</td>
                  <td>
                    <button className="btn btnGhost" onClick={() => startEdit(b)}>
                      Sửa
                    </button>{' '}
                    <button className="btn btnGhost" onClick={() => handleDelete(b.id)}>
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

