import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBookById, type Book } from '../data/books'
import { useCart } from '../context/CartContext'
import { fetchBook, type ApiBook } from '../lib/api'

export function BookDetail() {
  const { id } = useParams<{ id: string }>()
  const { addBook } = useCart()
  const [book, setBook] = useState<Book | null>(null)
  const [error, setError] = useState<string | null>(null)

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
        </div>
      </div>
    </div>
  )
}

