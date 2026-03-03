import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import type { Book } from '../data/books'

export type CartItem = {
  id: string
  title: string
  price: number
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  totalQuantity: number
  totalPrice: number
  addBook: (book: Book, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = 'bookstore-cart'

function loadInitial(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed as CartItem[]
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadInitial())

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore
    }
  }, [items])

  const value = useMemo<CartContextValue>(() => {
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0)
    const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.price, 0)

    return {
      items,
      totalQuantity,
      totalPrice,
      addBook(book, quantity = 1) {
        setItems((prev) => {
          const existing = prev.find((i) => i.id === book.id)
          if (existing) {
            return prev.map((i) =>
              i.id === book.id ? { ...i, quantity: i.quantity + quantity } : i,
            )
          }
          return [
            ...prev,
            {
              id: book.id,
              title: book.title,
              price: book.price,
              quantity,
            },
          ]
        })
      },
      removeItem(id) {
        setItems((prev) => prev.filter((i) => i.id !== id))
      },
      updateQuantity(id, quantity) {
        setItems((prev) =>
          prev
            .map((i) => (i.id === id ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        )
      },
      clear() {
        setItems([])
      },
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

