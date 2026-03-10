import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBookById, type Book } from '../data/books'
import { useCart } from '../context/CartContext'
import {
  fetchBook,
  type ApiBook,
  fetchReviews,
  createReview,
  type Review,
  fetchRecommendations,
} from '../lib/api'
import { useAuth } from '../context/AuthContext'

export function BookDetail() {
  const { id } = useParams<{ id: string }>()
  const { addBook } = useCart()
  const { user } = useAuth()
  const [book, setBook] = useState<Book | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({ rating: 5, content: '' })
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [recommended, setRecommended] = useState<ApiBook[]>([])
  const [recoError, setRecoError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        const api: ApiBook = await fetchBook(id)
        setBook({
          id: String(api.id),
          title: api.title,
          author: api.author,
          price: Number(api.price),
          cover: getBookById('clean-code')?.cover ?? '',
          shortDescription: api.description.slice(0, 80) || 'Không có mô tả ngắn.',
          description: api.description,
          tags: [],
        })
      } catch (e) {
        console.error(e)
        const fallback = getBookById(id)
        if (fallback) {
          setBook(fallback)
          setError('Không gọi được API book-service, đang dùng dữ liệu demo.')
        } else {
          setError('Không tìm thấy sách.')
        }
      }
    })()
  }, [id])

  useEffect(() => {
    if (!id) return
    const numericId = Number(id)
    if (!Number.isFinite(numericId)) return
    ;(async () => {
      try {
        const data = await fetchReviews(numericId)
        setReviews(data)
      } catch (e) {
        console.error(e)
        setReviewError('Không tải được đánh giá (comment-rate-service chưa chạy?).')
      }
    })()
  }, [id])

  useEffect(() => {
    if (!id) return
    const numericId = Number(id)
    if (!Number.isFinite(numericId)) return
    ;(async () => {
      try {
        const data = await fetchRecommendations(numericId)
        setRecommended(data)
      } catch (e) {
        console.error(e)
        setRecoError('Không tải được gợi ý sách (recommender-ai-service chưa chạy?).')
      }
    })()
  }, [id])

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault()
    setReviewError(null)
    if (!id) return
    const numericId = Number(id)
    if (!Number.isFinite(numericId)) return
    try {
      const created = await createReview({
        book_id: numericId,
        username: user?.username ?? 'Guest',
        rating: newReview.rating,
        content: newReview.content,
      })
      setReviews((prev) => [created, ...prev])
      setNewReview({ rating: 5, content: '' })
    } catch (err) {
      console.error(err)
      setReviewError('Gửi đánh giá thất bại.')
    }
  }

  if (error && !book) {
    return (
      <div className="page">
        <h1 className="h1">Lỗi tải sách</h1>
        <p className="muted">
          {error} <Link to="/books">Quay lại danh sách sách.</Link>
        </p>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="page">
        <p className="muted">Đang tải dữ liệu sách...</p>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1 className="h1">{book.title}</h1>
          <p className="muted">Tác giả: {book.author}</p>
          {error && <p className="muted">{error}</p>}
        </div>
      </div>

      <div className="bookDetail">
        <div className="bookDetailCoverWrap">
          <img src={book.cover} alt={book.title} className="bookDetailCover" />
        </div>
        <div className="bookDetailContent">
          <p className="bookDetailPrice">${book.price.toFixed(2)}</p>
          <p className="bookDetailDesc">{book.description}</p>
          {book.tags.length > 0 && (
            <div className="bookTags">
              {book.tags.map((t) => (
                <span key={t} className="pill pillGray">
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="bookDetailActions">
            <button
              className="btn btnPrimary"
              onClick={() => {
                addBook(book, 1)
              }}
            >
              Thêm vào giỏ
            </button>
            <Link to="/cart" className="btn btnGhost">
              Xem giỏ hàng
            </Link>
          </div>

          <div style={{ marginTop: 24 }}>
            <h2 className="h1" style={{ fontSize: 18 }}>
              Đánh giá
            </h2>
            {reviewError && <p className="muted">{reviewError}</p>}

            <form className="authForm" onSubmit={handleSubmitReview}>
              <label className="authField">
                <span>Rating (1–5)</span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview((s) => ({
                      ...s,
                      rating: Math.max(1, Math.min(5, Number(e.target.value) || 1)),
                    }))
                  }
                />
              </label>
              <label className="authField">
                <span>Nhận xét</span>
                <textarea
                  rows={2}
                  value={newReview.content}
                  onChange={(e) => setNewReview((s) => ({ ...s, content: e.target.value }))}
                />
              </label>
              <button className="btn btnPrimary authSubmit" type="submit">
                Gửi đánh giá
              </button>
            </form>

            {reviews.length > 0 && (
              <ul className="orderItemsList" style={{ marginTop: 12 }}>
                {reviews.map((r) => (
                  <li key={r.id}>
                    <strong>{r.username || 'Guest'}</strong> – {r.rating}/5 –{' '}
                    {new Date(r.created_at).toLocaleString()}
                    <br />
                    {r.content}
                  </li>
                ))}
              </ul>
            )}

            {recommended.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h2 className="h1" style={{ fontSize: 18 }}>
                  Gợi ý sách
                </h2>
                {recoError && <p className="muted">{recoError}</p>}
                <ul className="orderItemsList">
                  {recommended.map((b) => (
                    <li key={b.id}>
                      <Link to={`/books/${b.id}`}>{b.title}</Link> – {b.author}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

