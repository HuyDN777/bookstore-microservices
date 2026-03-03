const BOOK_BASE =
  import.meta.env.VITE_BOOK_SERVICE_URL ?? (typeof window !== 'undefined' ? 'http://localhost:8004' : '')
const ORDER_BASE =
  import.meta.env.VITE_ORDER_SERVICE_URL ?? (typeof window !== 'undefined' ? 'http://localhost:8006' : '')

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
  items: CreateOrderItem[]
}

export async function createOrder(payload: CreateOrderPayload) {
  const res = await fetch(`${ORDER_BASE}/orders/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_name: payload.customer_name ?? '',
      customer_email: payload.customer_email ?? '',
      items: payload.items,
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Order service error ${res.status}`)
  }
  return res.json() as Promise<unknown>
}

