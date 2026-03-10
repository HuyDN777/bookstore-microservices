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
  items: OrderItem[]
}

export function MyOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `${ORDER_BASE}/orders/?customer_username=${encodeURIComponent(user.username)}`,
        )
        if (!res.ok) throw new Error(`Order service error ${res.status}`)
        const data = (await res.json()) as Order[]
        setOrders(data)
      } catch (e) {
        console.error(e)
        setError('Không tải được lịch sử đơn hàng (order-service chưa chạy?).')
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  if (!user) {
    return (
      <div className="page">
        <h1 className="h1">Lịch sử đơn hàng</h1>
        <p className="muted">Bạn cần đăng nhập để xem lịch sử đơn hàng.</p>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1 className="h1">Đơn hàng của tôi</h1>
          <p className="muted">Danh sách các đơn hàng đã đặt với tài khoản {user.username}.</p>
          {error && <p className="muted">{error}</p>}
        </div>
      </div>

      {loading && <p className="muted">Đang tải...</p>}

      {!loading && orders.length === 0 && !error && (
        <p className="muted">Bạn chưa có đơn hàng nào.</p>
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

