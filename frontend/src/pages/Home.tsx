import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BOOKS, type Book } from '../data/books'
import { useCart } from '../context/CartContext'
import { fetchBooks, type ApiBook } from '../lib/api'

type UiBook = Book & { numericId?: number }

export function Home() {
  const { addBook } = useCart()
  const [books, setBooks] = useState<UiBook[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const apiBooks: ApiBook[] = await fetchBooks()
        if (!apiBooks.length) {
          setBooks(BOOKS)
          return
        }
        setBooks(
          apiBooks.map((b) => ({
            id: String(b.id),
            numericId: b.id,
            title: b.title,
            author: b.author,
            price: Number(b.price),
            cover: BOOKS[0]?.cover ?? '',
            shortDescription: b.description.slice(0, 80) || 'Không có mô tả ngắn.',
            description: b.description,
            tags: [],
          })),
        )
      } catch (e) {
        console.error(e)
        setError('Không gọi được API book-service, đang dùng dữ liệu demo trên frontend.')
        setBooks(BOOKS)
      }
    })()
  }, [])

  const data = books ?? BOOKS

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1 className="h1">Bookstore</h1>
          <p className="muted">Trang chủ hiển thị danh sách sách có thể thêm vào giỏ.</p>
          {error && <p className="muted">{error}</p>}
        </div>
      </div>

      <div className="booksGrid">
        {data.map((book) => (
          <article key={book.id} className="bookCard">
            <div className="bookCoverWrap">
              <img src={book.cover} alt={book.title} className="bookCover" />
            </div>
            <div className="bookContent">
              <h2 className="bookTitle">
                <Link to={`/books/${book.id}`}>{book.title}</Link>
              </h2>
              <p className="bookAuthor">{book.author}</p>
              <p className="bookShort">{book.shortDescription}</p>
              <div className="bookFooter">
                <div className="bookPrice">${book.price.toFixed(2)}</div>
                <div className="bookActions">
                  <Link to={`/books/${book.id}`} className="btn btnGhost">
                    Chi tiết
                  </Link>
                  <button
                    className="btn btnPrimary"
                    onClick={() => {
                      addBook(book, 1)
                    }}
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

