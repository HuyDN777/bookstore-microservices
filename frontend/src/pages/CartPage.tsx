import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createOrder } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export function CartPage() {
  const { items, totalPrice, totalQuantity, removeItem, updateQuantity, clear } = useCart()
  const { user } = useAuth()
  const hasItems = items.length > 0
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckout() {
    if (!hasItems || submitting) return
    setSubmitting(true)
    setMessage(null)
    setError(null)
    try {
      const payload = {
        customer_name: user?.username ?? 'Guest',
        customer_email: user?.email ?? 'guest@example.com',
        customer_username: user?.username ?? '',
        items: items.map((i) => ({
          book_title: i.title,
          unit_price: i.price,
          quantity: i.quantity,
        })),
      }
      const res = await createOrder(payload)
      setMessage('Đặt hàng thành công! (đã lưu vào order-service).')
      console.log('Order created', res)
      clear()
    } catch (e) {
      console.error(e)
      setError('Không gọi được API order-service, vui lòng thử lại sau.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1 className="h1">Giỏ hàng</h1>
          <p className="muted">
            {hasItems
              ? `${totalQuantity} sản phẩm trong giỏ. Tổng tiền tạm tính: $${totalPrice.toFixed(2)}`
              : 'Giỏ hàng đang trống. Hãy chọn vài cuốn sách nhé!'}
          </p>
          {message && <p className="muted">{message}</p>}
          {error && <p className="muted">{error}</p>}
        </div>
        {hasItems && (
          <div className="pageHeaderRight">
            <button className="btn btnGhost" onClick={() => clear()}>
              Xóa toàn bộ
            </button>
          </div>
        )}
      </div>

      {!hasItems && (
        <p className="muted">
          <Link to="/books">Quay lại danh sách sách để mua sắm.</Link>
        </p>
      )}

      {hasItems && (
        <>
          <div className="cartList">
            {items.map((item) => (
              <div key={item.id} className="cartItem">
                <div className="cartItemMain">
                  <div className="cartItemTitle">{item.title}</div>
                  <div className="cartItemMeta">
                    <span>Đơn giá: ${item.price.toFixed(2)}</span>
                    <span>Thành tiền: ${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
                <div className="cartItemActions">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Math.max(1, Number(e.target.value) || 1))
                    }
                    className="cartQtyInput"
                  />
                  <button className="btn btnGhost" onClick={() => removeItem(item.id)}>
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="checkoutBox">
            <div>
              <div className="checkoutLabel">Tổng thanh toán</div>
              <div className="checkoutValue">${totalPrice.toFixed(2)}</div>
            </div>
            <button className="btn btnPrimary" disabled={submitting} onClick={handleCheckout}>
              {submitting ? 'Đang đặt hàng...' : 'Đặt hàng'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

