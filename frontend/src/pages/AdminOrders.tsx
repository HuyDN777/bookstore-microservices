import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const ORDER_BASE =
  import.meta.env.VITE_ORDER_SERVICE_URL ??
  (typeof window !== 'undefined' ? 'http://localhost:8006' : '')

type OrderItem = {
  id: number
  book_title: string
  unit_price: string
  quantity: number
}

type Order = {
  id: number
  customer_name: string
  customer_email: string
  customer_username: string
  total_price: string
  created_at: string
  status: string
  items: OrderItem[]
}

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'completed', 'cancelled'] as const

export function AdminOrders() {
  const { user, token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.is_staff) return
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${ORDER_BASE}/orders/`)
        if (!res.ok) throw new Error(`Order service error ${res.status}`)
        const data = (await res.json()) as Order[]
        setOrders(data)
      } catch (e) {
        console.error(e)
        setError('Không tải được danh sách đơn hàng (order-service chưa chạy?).')
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  async function updateStatus(id: number, statusValue: string) {
    if (!token) {
      alert('Thiếu token staff, hãy đăng nhập lại.')
      return
    }
    try {
      const res = await fetch(`${ORDER_BASE}/orders/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
        body: JSON.stringify({ status: statusValue }),
      })
      if (!res.ok) throw new Error(`Order status update error ${res.status}`)
      const updated = (await res.json()) as Order
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)))
    } catch (e) {
      console.error(e)
      alert('Cập nhật trạng thái thất bại.')
    }
  }

  if (!user?.is_staff) {
    return (
      <div className="page">
        <h1 className="h1">Orders (Admin)</h1>
        <p className="muted">Chỉ nhân viên / admin mới truy cập được trang này.</p>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1 className="h1">Quản lý đơn hàng</h1>
          <p className="muted">
            Xem và cập nhật trạng thái đơn hàng. (API hiện tại chưa có bảo vệ thật sự, chỉ phía UI.)
          </p>
          {error && <p className="muted">{error}</p>}
        </div>
      </div>

      {loading && <p className="muted">Đang tải...</p>}

      {!loading && orders.length === 0 && !error && (
        <p className="muted">Chưa có đơn hàng nào.</p>
      )}

      {orders.length > 0 && (
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ngày tạo</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{new Date(o.created_at).toLocaleString()}</td>
                  <td>{o.customer_name || o.customer_username}</td>
                  <td>${Number(o.total_price).toFixed(2)}</td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="tdDetails">
                    <ul className="orderItemsList">
                      {o.items.map((it) => (
                        <li key={it.id}>
                          {it.book_title} × {it.quantity} (${Number(it.unit_price).toFixed(2)} mỗi
                          cuốn)
                        </li>
                      ))}
                    </ul>
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

