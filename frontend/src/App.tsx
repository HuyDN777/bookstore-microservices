import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Placeholder } from './pages/Placeholder'
import { Home } from './pages/Home'
import { BookDetail } from './pages/BookDetail'
import { CartPage } from './pages/CartPage'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { MyOrders } from './pages/MyOrders'
import { AdminOrders } from './pages/AdminOrders'
import { StaffLogin } from './pages/StaffLogin'
import { AdminBooks } from './pages/AdminBooks'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/books" replace />} />

        {/* Bookstore pages */}
        <Route path="/books" element={<Home />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/staff-login" element={<StaffLogin />} />

        {/* Technical dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Service sections (placeholder until backend endpoints are ready) */}
        <Route path="/catalog" element={<Placeholder title="Catalog Service" />} />
        <Route path="/customers" element={<Placeholder title="Customer Service" />} />
        <Route path="/orders" element={<AdminOrders />} />
        <Route path="/admin-books" element={<AdminBooks />} />
        <Route path="/payments" element={<Placeholder title="Pay Service" />} />
        <Route path="/shipping" element={<Placeholder title="Ship Service" />} />
        <Route path="/comments" element={<Placeholder title="Comment/Rate Service" />} />
        <Route path="/recommender" element={<Placeholder title="Recommender AI Service" />} />
        <Route path="/staff" element={<Placeholder title="Staff Service" />} />
        <Route path="/manager" element={<Placeholder title="Manager Service" />} />
        <Route path="/gateway" element={<Placeholder title="API Gateway" />} />

        <Route path="*" element={<Placeholder title="Not Found" />} />
      </Route>
    </Routes>
  )
}

