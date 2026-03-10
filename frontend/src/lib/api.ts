const BOOK_BASE =
  import.meta.env.VITE_BOOK_SERVICE_URL ?? (typeof window !== 'undefined' ? 'http://localhost:8004' : '')
const ORDER_BASE =
  import.meta.env.VITE_ORDER_SERVICE_URL ?? (typeof window !== 'undefined' ? 'http://localhost:8006' : '')
const REVIEW_BASE =
  import.meta.env.VITE_REVIEW_SERVICE_URL ??
  (typeof window !== 'undefined' ? 'http://localhost:8009' : '')
const RECOMMENDER_BASE =
  import.meta.env.VITE_RECOMMENDER_SERVICE_URL ??
  (typeof window !== 'undefined' ? 'http://localhost:8010' : '')

export type ApiBook = {
  id: number
  title: string
  author: string
  price: string
  description: string
  created_at: string
}

export async function fetchBooks(): Promise<ApiBook[]> {
  const res = await fetch(`${BOOK_BASE}/books/`)
  if (!res.ok) throw new Error(`Book service error ${res.status}`)
  return (await res.json()) as ApiBook[]
}

export async function fetchBook(id: string | number): Promise<ApiBook> {
  const res = await fetch(`${BOOK_BASE}/books/${id}/`)
  if (!res.ok) throw new Error(`Book not found`)
  return (await res.json()) as ApiBook
}

export type CreateOrderItem = {
  book_title: string
  unit_price: number
  quantity: number
}

export type CreateOrderPayload = {
  customer_name?: string
  customer_email?: string
  customer_username?: string
  items: CreateOrderItem[]
}

export async function createOrder(payload: CreateOrderPayload) {
  const res = await fetch(`${ORDER_BASE}/orders/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_name: payload.customer_name ?? '',
      customer_email: payload.customer_email ?? '',
      customer_username: payload.customer_username ?? '',
      items: payload.items,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Order service error ${res.status}`)
  }
  return res.json() as Promise<unknown>
}

export type Review = {
  id: number
  book_id: number
  username: string
  rating: number
  content: string
  created_at: string
}

export async function fetchReviews(bookId: number): Promise<Review[]> {
  const res = await fetch(`${REVIEW_BASE}/reviews/?book_id=${bookId}`)
  if (!res.ok) throw new Error(`Review service error ${res.status}`)
  return (await res.json()) as Review[]
}

export async function createReview(input: {
  book_id: number
  username: string
  rating: number
  content: string
}): Promise<Review> {
  const res = await fetch(`${REVIEW_BASE}/reviews/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Review create error ${res.status}`)
  }
  return (await res.json()) as Review
}

export async function fetchRecommendations(bookId: number): Promise<ApiBook[]> {
  const res = await fetch(`${RECOMMENDER_BASE}/recommend/?book_id=${bookId}`)
  if (!res.ok) throw new Error(`Recommender error ${res.status}`)
  return (await res.json()) as ApiBook[]
}
